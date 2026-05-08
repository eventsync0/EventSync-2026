import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const eventController = new EventController();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

router.post("/event", authMiddleware, eventController.createEvent);
router.put("/event/:id", authMiddleware, eventController.updateEvent);
router.delete("/event/:id", authMiddleware, eventController.deleteEvent);

export default router;