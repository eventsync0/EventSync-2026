import { SessionController } from "../controllers/session.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const sessionController = new SessionController();

router.post("/", authMiddleware, sessionController.postSession);
router.put("/:id",authMiddleware,sessionController.putSession);
router.get("/:id", sessionController.getSessionById);
router.get("/", sessionController.getSessions);
router.delete("/:id",authMiddleware,sessionController.deleteSession);
router.get('/sessions/room/:roomId', sessionController.getSessionsByRoom);
router.get('/sessions/live', sessionController.getLiveSessions);

export default router;