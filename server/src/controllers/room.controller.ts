import { RoomService } from "../services/room.service";
import { error } from "node:console";
import e, { Request, Response } from 'express';

export class RoomController {
    private roomService: RoomService;
    constructor() {
        this.roomService = new RoomService;
    }

    postRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id, name } = req.body;
            if (!id || !name) {
                res.status(400).json({ message: "Name and id required" })
            }
            const room = await this.roomService.postRoom(id, name);
            res.status(201).json({ message: "Room Created" })
        } catch (error) {
            res.status(400).json({ message: "...." })
        }
    }
}