
import e, { Request, Response } from 'express';
import { EventService } from '../services/event.service';

export class EventController {
   

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const events = await EventService.getEvents();
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve events" });
        }
    }

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const  id  = req.params.id as string;
            const event = await EventService.getEventById(id); 
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ error: "Failed to retrieve event" });
        }
    }

    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            
            const isArray = Array.isArray(data);
            const events = isArray ? data : [data];
            
            if (events.length === 0) {
                res.status(400).json({ error: "At least one event is required" });
                return;
            }
            
          
            const invalidEvents: Array<{ index: number; missingFields: string[] }> = [];
            
            events.forEach((event, index) => {
                const missingFields = [];
                if (!event.title) missingFields.push('title');
                if (!event.description) missingFields.push('description');
                if (!event.startDate) missingFields.push('startDate');
                if (!event.endDate) missingFields.push('endDate');
                if (!event.location) missingFields.push('location');
                
                if (missingFields.length > 0) {
                    invalidEvents.push({ index, missingFields });
                }
            });
            
            if (invalidEvents.length > 0) {
                res.status(400).json({
                    error: "Some events are missing required fields",
                    details: invalidEvents
                });
                return;
            }
            
            const formattedEvents = events.map(event => ({
                title: event.title,
                description: event.description,
                startDate: new Date(event.startDate),
                endDate: new Date(event.endDate),
                location: event.location
            }));
            
            const result = await EventService.createEvents(formattedEvents);
            
            if (isArray) {
                res.status(201).json({
                    success: true,
                    message: `${result.count} events created successfully`,
                    count: result.count
                });
            } else {
                const createdEvent = await EventService.getEventById(result.createdIds?.[0]);
                res.status(201).json(createdEvent);
            }
            
        } catch (error) {
            console.error('Error in createEvent:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to create event(s)" 
            });
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