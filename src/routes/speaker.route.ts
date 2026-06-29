import { Router } from "express";
import { SpeakerController } from "../controllers/speaker.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const speakerController = new SpeakerController();

/**
 * PUBLIC routes
 */
router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);

/**
 * ADMIN protected routes
 */
router.post("/", adminMiddleware, speakerController.createSpeaker);
router.put("/:id", adminMiddleware, speakerController.updateSpeaker);
router.delete("/:id", adminMiddleware, speakerController.deleteSpeaker);

export default router;