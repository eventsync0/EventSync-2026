import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/admin.middleware";
import { EventController } from "../controllers/event.controller";

const router = Router();
const adminController = new AdminController();
const eventController = new EventController();

router.post("/login", adminController.login);
router.post("/refresh", adminController.refresh); 
router.post("/logout",authMiddleware, adminController.logout);   
router.get("/me", authMiddleware, adminController.me);

router.post("/event", authMiddleware, eventController.createEvent);
router.put("/event/:id", authMiddleware, eventController.updateEvent);
router.delete("/event/:id", authMiddleware, eventController.deleteEvent);

export default router;