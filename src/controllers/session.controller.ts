import { SessionService } from "../services/session.service";
import { Response, Request } from "express";

export class SessionController {
    private sessionService: SessionService;
    constructor() {
        this.sessionService = new SessionService();
    }

    postSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { roomId, title, description, startTime, endTime, capacity } = req.body;
            if (!roomId || !title || !description || !startTime || !endTime || !capacity) {
                res.status(400).json({ message: "All fields are required" })
                return;
            }
            const session = await this.sessionService.postSession(
                roomId, title, description, new Date(startTime), new Date(endTime), capacity
            );
            res.status(201).json({ message: "Session created", data: session });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    getSessions = async (req: Request, res: Response): Promise<void> => {
        try {
            const sessions = await this.sessionService.getSessions();
            res.status(200).json({ data: sessions });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}