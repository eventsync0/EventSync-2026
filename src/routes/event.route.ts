// routes/event.routes.ts
import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const eventController = new EventController();

// Routes publiques
router.get("/", eventController.getEvents);
router.get("/search", eventController.searchEvents);
router.get("/category/:category", eventController.getEventsByCategory);
router.get("/:id", eventController.getEventById);

// Routes protégées (admin uniquement)
router.post("/", authMiddleware, eventController.createEvent);
router.put("/:id", authMiddleware, eventController.updateEvent);
router.delete("/:id", authMiddleware, eventController.deleteEvent);
router.get("/statistics", authMiddleware, eventController.getEventsStatistics);

export default router;