import { SessionController } from "../controllers/session.controller";
import { Router } from "express";

const router = Router();
const sessionController = new SessionController();

router.post("/", sessionController.postSession);

export default router;