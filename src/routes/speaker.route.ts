import { Router } from "express";
import { SpeakerController } from "../controllers/speaker.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const speakerController = new SpeakerController();

router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);

router.post("/", adminMiddleware, speakerController.createSpeaker);
router.put("/:id", adminMiddleware, speakerController.updateSpeaker);
router.delete("/:id", adminMiddleware, speakerController.deleteSpeaker);

export default router;