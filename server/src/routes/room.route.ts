import { RoomController } from "../controllers/room.controller";    
import { Router } from "express";

const router = Router();
const roomController = new RoomController();

router.post("/", roomController.postRoom);
router.get("/", roomController.getRooms)

export default router;