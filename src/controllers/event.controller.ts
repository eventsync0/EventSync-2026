import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import { EventCategory } from '../config/generated/prisma/enums';

export class EventController {

    getEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category, search, startDate, endDate, upcoming, past } = req.query;

            const filters: any = {};

            if (category && Object.values(EventCategory).includes(category as EventCategory)) {
                filters.category = category as EventCategory;
            } else if (category) {
                res.status(400).json({ 
                    error: "Invalid category. Must be one of: " + Object.values(EventCategory).join(', ')
                });
                return;
            }

            if (search) {
                filters.search = search as string;
            }

            if (startDate) {
                const start = new Date(startDate as string);
                if (isNaN(start.getTime())) {
                    res.status(400).json({ error: "Invalid startDate format" });
                    return;
                }
                filters.startDate = start;
            }

            if (endDate) {
                const end = new Date(endDate as string);
                if (isNaN(end.getTime())) {
                    res.status(400).json({ error: "Invalid endDate format" });
                    return;
                }
                filters.endDate = end;
            }

            let events;
            let metadata = {};

            if (upcoming === 'true') {
                events = await EventService.getUpcomingEvents();
                metadata = { type: 'upcoming' };
            } else if (past === 'true') {
                events = await EventService.getPastEvents();
                metadata = { type: 'past' };
            } else if (category && !search && !startDate && !endDate) {
                events = await EventService.getEventsByCategory(category as EventCategory);
                metadata = { category };
            } else if (Object.keys(filters).length > 0) {
                events = await EventService.getEventsWithFilters(filters);
                metadata = { filters };
            } else {
                events = await EventService.getEvents();
            }

            const eventsWithAttendees = events.map(event => ({
                ...event,
                attendees: Math.floor(Math.random() * 100) + 10 
            }));

            res.status(200).json({
                success: true,
                data: eventsWithAttendees,
                count: eventsWithAttendees.length,
                ...metadata
            });
        } catch (error) {
            console.error('Error in getEvents:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to retrieve events" 
            });
        }
    }

    getEventById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const event = await EventService.getEventById(id);
            
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }

            const eventWithAttendees = {
                ...event,
                attendees: Math.floor(Math.random() * 100) + 10
            };

            res.status(200).json({
                success: true,
                data: eventWithAttendees
            });
        } catch (error) {
            console.error('Error in getEventById:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to retrieve event" 
            });
        }
    }


    createEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;

            const isArray = Array.isArray(data);
            const events = isArray ? data : [data];
            
            if (events.length === 0) {
                res.status(400).json({ 
                    error: "At least one event is required" 
                });
                return;
            }
            
            const invalidEvents: Array<{ index: number; missingFields: string[] }> = [];
            const invalidCategories: Array<{ index: number; category: string }> = [];
            
            events.forEach((event, index) => {
                const missingFields = [];
                if (!event.title) missingFields.push('title');
                if (!event.description) missingFields.push('description');
                if (!event.category) {
                    missingFields.push('category');
                } else if (!Object.values(EventCategory).includes(event.category)) {
                    invalidCategories.push({ 
                        index, 
                        category: event.category 
                    });
                }
                if (!event.startDate) missingFields.push('startDate');
                if (!event.endDate) missingFields.push('endDate');
                if (!event.location) missingFields.push('location');
                
                if (missingFields.length > 0) {
                    invalidEvents.push({ index, missingFields });
                }
            });
            
            if (invalidCategories.length > 0) {
                res.status(400).json({
                    error: "Invalid category provided",
                    details: invalidCategories.map(item => ({
                        index: item.index,
                        category: item.category,
                        validCategories: Object.values(EventCategory)
                    }))
                });
                return;
            }

            if (invalidEvents.length > 0) {
                res.status(400).json({
                    error: "Some events are missing required fields",
                    details: invalidEvents
                });
                return;
            }

            const dateErrors: Array<{ index: number; error: string }> = [];
            const formattedEvents = events.map((event, index) => {
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);

                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                    dateErrors.push({ 
                        index, 
                        error: "Invalid date format" 
                    });
                    return null;
                }

                if (startDate >= endDate) {
                    dateErrors.push({ 
                        index, 
                        error: "Start date must be before end date" 
                    });
                    return null;
                }

                return {
                    title: event.title,
                    description: event.description,
                    category: event.category,
                    startDate,
                    endDate,
                    location: event.location
                };
            });

            if (dateErrors.length > 0) {
                res.status(400).json({
                    error: "Invalid dates provided",
                    details: dateErrors
                });
                return;
            }

            const validEvents = formattedEvents.filter(e => e !== null);
            
            if (validEvents.length === 0) {
                res.status(400).json({ 
                    error: "No valid events to create" 
                });
                return;
            }
  
            const result = await EventService.createEvents(validEvents);
            
            const createdEvents = await Promise.all(
                result.createdIds.map(id => EventService.getEventById(id))
            );
            
            if (isArray) {
                res.status(201).json({
                    success: true,
                    message: `${result.count} events created successfully`,
                    count: result.count,
                    data: createdEvents
                });
            } else {
                res.status(201).json({
                    success: true,
                    message: "Event created successfully",
                    data: createdEvents[0]
                });
            }
            
        } catch (error) {
            console.error('Error in createEvent:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to create event(s)" 
            });
        }
    }

    // Note : les sessions ne se gèrent plus depuis cet endpoint. Utiliser les
    // endpoints dédiés /api/sessions pour créer/modifier/supprimer une session.
    updateEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { title, description, category, startDate, endDate, location } = req.body;

            const existingEvent = await EventService.getEventById(id);
            if (!existingEvent) {
                res.status(404).json({ error: "Event not found" });
                return;
            }

            if (category && !Object.values(EventCategory).includes(category)) {
                res.status(400).json({
                    error: "Invalid category. Must be one of: " + Object.values(EventCategory).join(', ')
                });
                return;
            }

            let start, end;
            if (startDate) {
                start = new Date(startDate);
                if (isNaN(start.getTime())) {
                    res.status(400).json({ error: "Invalid start date format" });
                    return;
                }
            }

            if (endDate) {
                end = new Date(endDate);
                if (isNaN(end.getTime())) {
                    res.status(400).json({ error: "Invalid end date format" });
                    return;
                }
            }

            if (start && end && start >= end) {
                res.status(400).json({ 
                    error: "Start date must be before end date" 
                });
                return;
            }

            const updateData: any = {};
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (category !== undefined) updateData.category = category;
            if (start !== undefined) updateData.startDate = start;
            if (end !== undefined) updateData.endDate = end;
            if (location !== undefined) updateData.location = location;

            if (Object.keys(updateData).length === 0) {
                res.status(400).json({ 
                    error: "At least one field must be provided for update" 
                });
                return;
            }

            await EventService.updateEvent(id, updateData);

            const eventWithSessions = await EventService.getEventWithSessions(id);

            res.status(200).json({
                success: true,
                message: "Event updated successfully",
                data: eventWithSessions
            });
        } catch (error) {
            console.error('Error in updateEvent:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to update event" 
            });
        }
    }

    // La suppression entraîne la suppression en cascade des sessions associées
    // (et de leurs questions), gérée au niveau base de données (onDelete: Cascade).
    deleteEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            const existingEvent = await EventService.getEventById(id);
            if (!existingEvent) {
                res.status(404).json({ error: "Event not found" });
                return;
            }

            await EventService.deleteEvent(id);
            
            res.status(200).json({
                success: true,
                message: "Event deleted successfully"
            });
        } catch (error) {
            console.error('Error in deleteEvent:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to delete event" 
            });
        }
    }

    getEventsByCategory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { category } = req.params;

            if (!Object.values(EventCategory).includes(category as EventCategory)) {
                res.status(400).json({
                    error: "Invalid category. Must be one of: " + Object.values(EventCategory).join(', ')
                });
                return;
            }

            const events = await EventService.getEventsByCategory(category as EventCategory);

            res.status(200).json({
                success: true,
                data: events,
                count: events.length,
                category
            });
        } catch (error) {
            console.error('Error in getEventsByCategory:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to retrieve events by category" 
            });
        }
    }

    getEventsStatistics = async (_req: Request, res: Response): Promise<void> => {
        try {
            const totalEvents = await EventService.getEvents();
            const now = new Date();
            
            const upcomingEvents = totalEvents.filter(event => 
                new Date(event.startDate) >= now
            );
            
            const pastEvents = totalEvents.filter(event => 
                new Date(event.endDate) < now
            );

            const categories = await EventService.getEventsCountByCategory();

            res.status(200).json({
                success: true,
                data: {
                    total: totalEvents.length,
                    upcoming: upcomingEvents.length,
                    past: pastEvents.length,
                    byCategory: categories
                }
            });
        } catch (error) {
            console.error('Error in getEventsStatistics:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to retrieve statistics" 
            });
        }
    }

    searchEvents = async (req: Request, res: Response): Promise<void> => {
        try {
            const { q } = req.query;

            if (!q || typeof q !== 'string' || q.trim().length === 0) {
                res.status(400).json({ 
                    error: "Search query is required" 
                });
                return;
            }

            const events = await EventService.searchEvents(q.trim());

            res.status(200).json({
                success: true,
                data: events,
                count: events.length,
                searchTerm: q
            });
        } catch (error) {
            console.error('Error in searchEvents:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to search events" 
            });
        }
    }

    getEventsInDateRange = async (req: Request, res: Response): Promise<void> => {
        try {
            const { startDate, endDate } = req.query;

            if (!startDate || !endDate) {
                res.status(400).json({ 
                    error: "Both startDate and endDate are required" 
                });
                return;
            }

            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                res.status(400).json({ error: "Invalid date format" });
                return;
            }

            if (start >= end) {
                res.status(400).json({ 
                    error: "Start date must be before end date" 
                });
                return;
            }

            const events = await EventService.getEventsInDateRange(start, end);

            res.status(200).json({
                success: true,
                data: events,
                count: events.length,
                startDate: start,
                endDate: end
            });
        } catch (error) {
            console.error('Error in getEventsInDateRange:', error);
            res.status(500).json({ 
                error: error instanceof Error ? error.message : "Failed to retrieve events in date range" 
            });
        }
    }
}