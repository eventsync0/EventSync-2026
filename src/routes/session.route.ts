import { SessionController } from "../controllers/session.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const sessionController = new SessionController();

router.post("/", authMiddleware, sessionController.postSession);
router.put("/:id",authMiddleware, sessionController.putSession);

export default router;