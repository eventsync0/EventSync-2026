import { SessionService } from "../services/session.service";
import { Response, Request } from "express";

export class SessionController {
    private sessionService: SessionService;
    constructor() {
        this.sessionService = new SessionService();
    }

     postSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { roomId, title, description, startTime, endTime, capacity, speakerIds } = req.body;

            if (!roomId || !title || !description || !startTime || !endTime || !capacity) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            if (!speakerIds || !Array.isArray(speakerIds) || speakerIds.length === 0) {
                res.status(400).json({ message: "At least one speaker is required" });
                return;
            }

            const session = await this.sessionService.postSession(
                roomId, title, description,
                new Date(startTime), new Date(endTime),
                capacity, speakerIds
            );

            res.status(201).json({ message: "Session created", data: session });
        } catch (error: any) {
            if (error.message === "At least one speaker is required") {
                res.status(400).json({ message: error.message });
                return;
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
    putSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const { roomId, title, description, startTime, endTime, capacity, speakerIds } = req.body;

        if (!id) {
            res.status(400).json({ message: "Id required" });
            return;
        }

        if (!roomId || !title || !description || !startTime || !endTime || !capacity) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        if (!speakerIds || !Array.isArray(speakerIds) || speakerIds.length === 0) {
            res.status(400).json({ message: "At least one speaker is required" });
            return;
        }

        const session = await this.sessionService.putSession(
            id, roomId, title, description,
            new Date(startTime), new Date(endTime),
            capacity, speakerIds
        );

        res.status(200).json({ message: "Session updated", data: session });
    } catch (error: any) {
        if (error.message === "At least one speaker is required") {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
}
}