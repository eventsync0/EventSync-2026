import { RoomController } from "../controllers/room.controller";    
import { Router } from "express";

const router = Router();
const roomController = new RoomController();

router.post("/", roomController.postRoom);
router.get("/", roomController.getRooms);
router.delete("/:id", roomController.deleteRoom);

export default router;