import { SessionController } from "../controllers/session.controller";
import { Router } from "express";

const router = Router();
const sessionController = new SessionController();

router.get("/", sessionController.getSessions);
router.get("/:id", sessionController.getSession);
router.post("/", sessionController.postSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);

export default router;