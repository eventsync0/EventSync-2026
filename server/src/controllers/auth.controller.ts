
import e, { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';



export class AuthController {
    private authService: AuthService;
    constructor() {
       this.authService = new AuthService();
    }
     register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({ error: "Name, email, and password are required" });
                return;
            }
            const user = await this.authService.register(name, email, password);
            res.status(201).json({ message: "User registered successfully", user });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
        }
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: "Email and password are required" });
                return;
            }
            const { user, accessToken, refreshToken } = await AuthService.login(email, password);
            res.status(200).json({ message: "Login successful", user, accessToken, refreshToken });
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
            const { accessToken } = await AuthService.refreshToken(refreshToken);
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
            await AuthService.logout(refreshToken);
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            res.status(400).json({ error: error instanceof Error ? error.message : "Logout failed" });
        }
    }
}
