

import { Request, Response } from "express";

import crypto from "crypto";

import { User } from "../models/user.model";
import { redis } from "../config/redis";

export const initializeConnection = async (
    req: Request,
    res: Response,
) => {
    try {
        const { username, roomId } = req.body;

        if (!username || !roomId) {
            return res.status(400).json({
                message: "username and room are required",
            });
        }

        const existingUser = await User.findOne({
            where: { username },
        });

        /*
         * 1. Création du User en base
         */
        const user = existingUser ?? await User.create({
            id: crypto.randomUUID(),
            username,
        });

        /*
         * 2. Création d'un identifiant de session
         */
        const sessionId = crypto.randomUUID();

        /*
         * 3. Stockage de l'état temporaire dans Redis
         */
        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user.id,
                roomId,
                status: "active",
            }),
            {
                EX: 60 * 30,
            },
        );

        /*
         * 4. Stockage de la session dans un cookie (p)
         */
        // https://expressjs.com/en/5x/api/response/#rescookie
        res.cookie("session_id", sessionId, {
            httpOnly: true, // empêche JavaScript côté navigateur d'accéder au cookie (document.cookie)
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 60 * 1000,
        });

        return res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Initialize connection error:", error);

        return res.status(500).json({
            message: "Failed to initialize connection",
        });
    }
};

export const getCurrentUser = async (
    req: Request,
    res: Response,
) => {
    try {
        const sessionId = req.cookies.session_id;  // on récupère l'id de la session de l'utilisateur connecté

        if (!sessionId) {
            return res.status(401).json({
                message: "No active session",
            });
        }

        const session = await redis.get( // 
            `session:${sessionId}`,
        );

        if (!session) {
            return res.status(401).json({
                message: "Session expired",
            });
        }

        const data = JSON.parse(session);

        // Si y en a un, on récupère l'user connecté à partir de son id et la session
        const user = await User.findByPk(data.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
            },
            roomId: data.roomId,
            status: data.status,
        });
    } catch (error) {
        console.error("Get current user error:", error);

        return res.status(500).json({
            message: "Failed to get current user",
        });
    }
};