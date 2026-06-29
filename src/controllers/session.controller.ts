import { SessionService } from "../services/session.service";
import { RoomService } from "../services/room.service";
import { EventService } from "../services/event.service";
import { Response, Request } from "express";

export class SessionController {
  private sessionService: SessionService;
  private roomService: RoomService;
  private eventService: EventService;

  constructor() {
    this.sessionService = new SessionService();
    this.roomService = new RoomService();
    this.eventService = new EventService();
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

      if (!id) {
        res.status(400).json({ error: "Session ID is required" });
        return;
      }

      const session = await this.sessionService.getSessionById(id);

      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }

      res.status(200).json({ data: session });
    } catch (error: any) {
      console.error("GET SESSION BY ID ERROR:", error);
      res.status(500).json({ error: "Server error", details: error.message });
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

      if (!speakerIds || !Array.isArray(speakerIds) || speakerIds.length === 0) {
        res.status(400).json({ message: "At least one speaker is required" });
        return;
      }

      const start = new Date(startTime);
      const end = new Date(endTime);
      const startHour = start.getHours();
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes();
      console.log("🔍 VALIDATION:", { startHour, startMinute, endHour, endMinute, startTime, endTime });


      if (startHour < 7 || startHour > 19 || (startHour === 19 && startMinute > 59)) {
        res.status(400).json({
          message: "Session must start between 7:00 and 19:59"
        });
        return;
      }

      if (endHour < 7 || endHour >= 20) {
        res.status(400).json({
          message: "Session must end between 7:00 and 20:00 (20:00 excluded)"
        });
        return;
      }

      if (start >= end) {
        res.status(400).json({
          message: "Start time must be before end time"
        });
        return;
      }

      const room = await this.roomService.getRoomById(roomId);
      if (!room) {
        res.status(400).json({ message: "Room does not exist" });
        return;
      }

      const event = await EventService.getEventById(eventId);
      if (!event) {
        res.status(400).json({ message: "Event does not exist" });
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
      if (error.message === "One or more speakers do not exist") {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error(error);
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

      if (!speakerIds || !Array.isArray(speakerIds) || speakerIds.length === 0) {
        res.status(400).json({ message: "At least one speaker is required" });
        return;
      }

      const start = new Date(startTime);
      const end = new Date(endTime);
      const startHour = start.getHours(); 
      const startMinute = start.getMinutes();
      const endHour = end.getHours();
      const endMinute = end.getMinutes(); 

      if (startHour < 7 || startHour > 19 || (startHour === 19 && startMinute > 59)) {
        res.status(400).json({
          message: "Session must start between 7:00 and 19:59"
        });
        return;
      }

      if (endHour < 7 || endHour > 20 || (endHour === 20 && endMinute > 0)) {
        res.status(400).json({
          message: "Session must end between 7:00 and 20:00 (20:00 excluded)"
        });
        return;
      }

      if (start >= end) {
        res.status(400).json({
          message: "Start time must be before end time"
        });
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


  getSessionsByRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const roomId = req.params.roomId as string;

      if (!roomId) {
        res.status(400).json({ error: "Room ID is required" });
        return;
      }

      const sessions = await this.sessionService.getSessionsByRoom(roomId);

      res.status(200).json({
        data: sessions,
        count: sessions.length
      });
    } catch (error: any) {
      console.error('GET SESSIONS BY ROOM ERROR:', error);
      res.status(500).json({
        error: "Server error",
        details: error.message
      });
    }
  };

  getLiveSessions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const liveSessions = await this.sessionService.getLiveSessions();

      res.status(200).json({
        data: liveSessions,
        count: liveSessions.length
      });
    } catch (error: any) {
      console.error('GET LIVE SESSIONS ERROR:', error);
      res.status(500).json({
        error: "Server error",
        details: error.message
      });
    }
  };
}