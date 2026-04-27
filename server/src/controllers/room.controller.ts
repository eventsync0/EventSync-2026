import { RoomService } from "../services/room.service";
import { Request, Response } from 'express';

export class RoomController {
    private roomService: RoomService;
    constructor() {
        this.roomService = new RoomService;
    }

    postRoom = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.body;
            if (!name) {
                res.status(400).json({ message: "Name and id required" });
                return;
            }
            const room = await this.roomService.postRoom(name);
            res.status(201).json({ message: "Room Created", room })
        } catch (error) {
            res.status(400).json({ message: "...." })
        }
    }
}