
import e, { Request, Response } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
   

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const events = await EventService.getEvents();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Failed to retrieve events" });
        }
    }

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const event = await EventService.getEventById(id);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Failed to retrieve event" });
        }
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { title, description, startDate, endDate, location } = req.body;
            if (!title || !description || !startDate || !endDate || !location) {
                res.status(400).json({ error: "All fields are required" });
                return;
            }
            const event = await EventService.createEvent({ title, description, startDate, endDate, location });
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create event" });
        }
    }

    updateEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const { title, description, startDate, endDate, location } = req.body;
            if (!title || !description || !startDate || !endDate || !location) {
                res.status(400).json({ error: "All fields are required" });
                return;
            }
            const event = await EventService.updateEvent(id, { title, description, startDate, endDate, location });
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update event" });
        }
    }

    deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            await EventService.deleteEvent(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete event" });
        }
    }
}