import { SessionService } from "../services/session.service";
import { Response, Request } from "express";

export class SessionController {
    private sessionService: SessionService;

    constructor() {
        this.sessionService = new SessionService();
    }

    getSessions = async (req: Request, res: Response): Promise<void> => {
        try {
            const sessions = await this.sessionService.getSessions();
            res.status(200).json({ data: sessions });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    getSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const session = await this.sessionService.getSession(id);

            if (!session) {
                res.status(404).json({ message: "Session not found" });
                return;
            }

            res.status(200).json({ data: session });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    postSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { roomId, title, description, startTime, endTime, capacity } = req.body;

            if (!roomId || !title || !description || !startTime || !endTime || !capacity) {
                res.status(400).json({ message: "All fields are required" });
                return;
            }

            const session = await this.sessionService.postSession(
                roomId,
                title,
                description,
                new Date(startTime),
                new Date(endTime),
                capacity
            );

            res.status(201).json({ data: session });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    updateSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const data = req.body;

            const updatedSession = await this.sessionService.updateSession(id, data);

            res.status(200).json({ data: updatedSession });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    deleteSession = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };

            await this.sessionService.deleteSession(id);

            res.status(200).json({ message: "Session deleted" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}