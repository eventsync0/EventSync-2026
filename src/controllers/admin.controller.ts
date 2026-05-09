import e, { Request, Response } from 'express';
import { AdminService} from '../services/admin.service';

export class AdminController {
   
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required" });
                return;
            }
            const { admin, accessToken, refreshToken } = await AdminService.login(email, password);
            res.status(200).json({ message: "Login successful", admin, accessToken, refreshToken });
        } catch (error) {
            res.status(401).json({ error: error instanceof Error ? error.message : "Login failed" });
        }
    }

    refresh = async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ error: "Refresh token is required" });
                return;
            }
            const { accessToken } = await AdminService.refreshToken(refreshToken);
            res.status(200).json({ message: "Token refreshed successfully", accessToken });
        } catch (error) {
            res.status(401).json({ error: error instanceof Error ? error.message : "Token refresh failed" });
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({ error: "Refresh token is required" });
                return;
            }
            await AdminService.logout(refreshToken);
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : "Logout failed" });
        }
    }

    me = async (req: Request, res: Response): Promise<void> => {
        try {
            const adminId = (req as any).userId;
            if (!adminId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const admin = await AdminService.me(adminId);
            res.status(200).json({ admin });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : "Failed to retrieve admin info" });
        }
    }
}
