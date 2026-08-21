import { randomUUID } from "node:crypto";
import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";

import { redis } from "../config/redis";
import { User } from "../models/user.model";
import type { Message } from "../types/message";

interface Session {
	userId: string;
	roomId: string;
	status: string;
}

interface SocketUser {
	id: string;
	username: string;
}

interface SocketData {
	session: Session;
	user: SocketUser;
	roomId?: string;
}

interface SendMessagePayload {
	roomId: string;
	body: string;
}

interface JoinRoomPayload {
	roomId: string;
}

const messagesByRoom = new Map<string, Message[]>();

function getRoomUsersKey(roomId: string) {
	return `room:${roomId}:users`;
}

function getRoomSocketsKey(roomId: string) {
	return `room:${roomId}:sockets`;
}

function getUserRoomSocketsKey(roomId: string, userId: string) {
	return `room:${roomId}:user:${userId}:sockets`;
}

async function getRoomUsers(roomId: string): Promise<SocketUser[]> {
	const userIds = await redis.sMembers(getRoomUsersKey(roomId));

	if (userIds.length === 0) {
		return [];
	}

	const users = await User.findAll({ where: { id: userIds } });

	return users.map((roomUser) => ({
		id: roomUser.id,
		username: roomUser.username,
	}));
}

function getSessionId(cookieHeader?: string) {
	return cookieHeader
		?.split(";")
		.map((cookie) => cookie.trim().split("="))
		.find(([name]) => name === "session_id")?.[1];
}

export function createWebSocketServer(httpServer: HttpServer) {
	const io = new Server<
		{
			"room:join": (data: JoinRoomPayload) => void;
			"room:leave": () => void;
			"message:send": (payload: SendMessagePayload) => void;
		},
		{
			"room:history": (messages: Message[]) => void;
			"message:new": (message: Message) => void;
			"room:error": (message: string) => void;
			"room:users": (users: SocketUser[]) => void;
		},
		Record<string, never>,
		SocketData
	>(httpServer, {
		cors: {
			origin: "http://localhost:5173",
			credentials: true,
		},
	});

	/**
	 * Authentification du socket avec la session présente dans le cookie.
	 */
	io.use(async (socket, next) => {
		try {
			const sessionId = getSessionId(
				socket.handshake.headers.cookie
			);

			if (!sessionId) {
				return next(new Error("Not authenticated"));
			}

			const sessionJson = await redis.get(`session:${sessionId}`);

			if (!sessionJson) {
				return next(new Error("Session expired"));
			}

			const session = JSON.parse(sessionJson) as Session;

			const user = await User.findByPk(session.userId);

			if (!user) {
				return next(new Error("User not found"));
			}

			socket.data.session = session;

			socket.data.user = {
				id: user.id,
				username: user.username,
			};

			return next();
		} catch (error) {
			console.error("Socket authentication error:", error);

			return next(
				new Error("Socket authentication failed")
			);
		}
	});

	io.on("connection", (socket) => {
		const { session, user } = socket.data;

		console.log("Socket connected:", socket.id);
		console.log("User:", user.username);

		/**
		 * L'utilisateur rejoint une room.
		 */
		socket.on("room:join", async (data) => {
			const roomId = String(data.roomId);

			const roomName = `room:${roomId}`;

			/**
			 * Évite de rejoindre plusieurs fois la même room.
			 */
			if (socket.data.roomId === roomId) {
				socket.emit("room:users", await getRoomUsers(roomId));
				return;
			}

			const previousRoomId = socket.data.roomId;

			if (previousRoomId) {
				await leaveRoom(previousRoomId);
			}

			socket.data.roomId = roomId;

			/**
			 * Ajoute le socket à la room.
			 */
			await socket.join(roomName);
			await redis.sAdd(getRoomUsersKey(roomId), user.id);
			await redis.sAdd(getRoomSocketsKey(roomId), socket.id);
			await redis.sAdd(
				getUserRoomSocketsKey(roomId, user.id),
				socket.id
			);

			await broadcastRoomUsers(roomId);

			socket.emit(
				"room:history",
				messagesByRoom.get(roomId) ?? []
			);

			console.log(
				`${user.username} joined ${roomName}`
			);
		});

		async function broadcastRoomUsers(roomId: string) {
			io.to(`room:${roomId}`).emit(
				"room:users",
				await getRoomUsers(roomId)
			);
		}

		async function leaveRoom(roomId: string) {
			const roomName = `room:${roomId}`;

			await redis.sRem(getRoomSocketsKey(roomId), socket.id);
			await redis.sRem(
				getUserRoomSocketsKey(roomId, user.id),
				socket.id
			);

			if (
				(await redis.sCard(
					getUserRoomSocketsKey(roomId, user.id)
				)) === 0
			) {
				await redis.sRem(getRoomUsersKey(roomId), user.id);
			}

			await socket.leave(roomName);
			await broadcastRoomUsers(roomId);
		}

		socket.on("room:leave", async () => {
			const roomId = socket.data.roomId;

			if (!roomId) {
				return;
			}

			await leaveRoom(roomId);
			delete socket.data.roomId;
		});

		/**
		 * Envoie un message dans une room.
		 */
		socket.on("message:send", ({ roomId, body }) => {
			const trimmedBody = body.trim();
			const normalizedRoomId = String(roomId);

			/**
			 * Vérifie le contenu du message.
			 */
			if (!trimmedBody) {
				return;
			}

			/**
			 * Vérifie que l'utilisateur envoie le message
			 * dans la room qu'il a rejointe.
			 */
			if (socket.data.roomId !== normalizedRoomId) {
				return;
			}

			const message: Message = {
				id: randomUUID(),
				roomId: normalizedRoomId,
				sender: user.username,
				body: trimmedBody,
				timestamp: Date.now(),
			};

			const roomMessages =
				messagesByRoom.get(normalizedRoomId) ?? [];

			roomMessages.push(message);

			messagesByRoom.set(
				normalizedRoomId,
				roomMessages.slice(-100)
			);

			/**
			 * Envoie le message à tous les utilisateurs
			 * présents dans la room.
			 */
			io.to(`room:${normalizedRoomId}`).emit(
				"message:new",
				message
			);
		});

		/**
		 * Déconnexion du socket.
		 */
		socket.on("disconnect", async () => {
			const roomId = socket.data.roomId;

			console.log(
				"Socket disconnected:",
				socket.id
			);

			if (!roomId) {
				return;
			}

			await leaveRoom(roomId);

			console.log(
				`${user.username} left room:${roomId}`
			);
		});
	});

	return io;
}