import { Router } from "express";
import { EventController } from "../controllers/event.controller";

const router = Router();
const eventController = new EventController();

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

export default router;