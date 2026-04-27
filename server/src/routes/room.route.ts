import { RoomController } from "../controllers/room.controller";    
import { Router } from "express";

const router = Router();
const roomController = new RoomController();

router.post("/", roomController.postRoom);

export default router;