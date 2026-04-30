import { RoomController } from "../controllers/room.controller" 
import { Router } from "express";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const roomController = new RoomController();

router.post("/", authMiddleware,roomController.postRoom);
router.get("/", roomController.getRooms);
router.delete("/:id", authMiddleware,roomController.deleteRoom);
router.get("/:id/sessions", roomController.getRoomSessions);

export default router;