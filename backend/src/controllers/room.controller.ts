import { Request, Response } from "express";
import { Room } from "../models/room.model";

/**
 * Récupère toutes les rooms.
 */
export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.findAll();

    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Erreur lors de la récupération des rooms :", error);

    return res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};

/**
 * Récupère une room par son identifiant.
 */
export const getRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const room = await Room.findByPk(id);

    if (!room) {
      return res.status(404).json({
        message: "Room introuvable",
      });
    }

    return res.status(200).json(room);
  } catch (error) {
    console.error("Erreur lors de la récupération de la room :", error);

    return res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
};
