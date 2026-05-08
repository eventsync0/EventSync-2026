import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/admin.middleware";

const router = Router();
const adminController = new AdminController();

router.post("/login", adminController.login);
router.post("/refresh", adminController.refresh); 
router.post("/logout",authMiddleware, adminController.logout);   
router.get("/me", authMiddleware, adminController.me);


export default router;