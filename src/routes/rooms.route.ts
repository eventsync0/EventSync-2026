import { RoomController } from "../controllers/room.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const roomController = new RoomController();

router.post("/", authMiddleware, roomController.postRoom);
router.get("/", roomController.getRooms);

// ✅ GET /:id doit être AVANT /:id/sessions
// sinon Express ne l'atteint jamais dans cet ordre
router.get("/:id", roomController.getRoom);
router.get("/:id/sessions", roomController.getRoomSessions);

router.delete("/:id", authMiddleware, roomController.deleteRoom);

export default router;