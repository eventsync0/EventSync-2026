import { SessionService } from "../services/session.service";
import { Response, Request } from "express";

export class SessionController {
  private sessionService: SessionService;
  constructor() {
    this.sessionService = new SessionService();
  }

  getSessions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const sessions = await this.sessionService.getSessions();
      res.status(200).json({ data: sessions });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getSessionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const session = await this.sessionService.getSessionById(id);

      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      res.status(200).json({ data: session });
    } catch (error) {
      console.error("GET SESSION BY ID ERROR:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

  postSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        eventId,
        roomId,
        title,
        description,
        startTime,
        endTime,
        capacity,
        speakerIds,
      } = req.body;

      if (
        !eventId ||
        !roomId ||
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !capacity
      ) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      if (
        !speakerIds ||
        !Array.isArray(speakerIds) ||
        speakerIds.length === 0
      ) {
        res.status(400).json({ message: "At least one speaker is required" });
        return;
      }

      const session = await this.sessionService.postSession(
        eventId,
        roomId,
        title,
        description,
        new Date(startTime),
        new Date(endTime),
        capacity,
        speakerIds,
      );

      res.status(201).json({ message: "Session created", data: session });
    } catch (error: any) {
      if (error.message === "At least one speaker is required") {
        res.status(400).json({ message: error.message });
        return;
      }
    res.status(500).json({ message: "Internal server error" });
    }
  };

  putSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const {
        eventId,
        roomId,
        title,
        description,
        startTime,
        endTime,
        capacity,
        speakerIds,
      } = req.body;

      if (!id) {
        res.status(400).json({ message: "Id required" });
        return;
      }

      if (
        !roomId ||
        !title ||
        !description ||
        !startTime ||
        !endTime ||
        !capacity
      ) {
        res.status(400).json({ message: "All fields are required" });
        return;
      }

      if (
        !speakerIds ||
        !Array.isArray(speakerIds) ||
        speakerIds.length === 0
      ) {
        res.status(400).json({ message: "At least one speaker is required" });
        return;
      }

      const session = await this.sessionService.putSession(
        id,
        eventId,
        roomId,
        title,
        description,
        new Date(startTime),
        new Date(endTime),
        capacity,
        speakerIds,
      );

      res.status(200).json({ message: "Session updated", data: session });
    } catch (error: any) {
      if (error.message === "At least one speaker is required") {
        res.status(400).json({ message: error.message });
        return;
      }
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