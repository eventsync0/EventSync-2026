import { RoomController } from "../controllers/room.controller";    
import { Router } from "express";

const router = Router();
const roomController = new RoomController();

router.post("/room", roomController.postRoom);

export default router;