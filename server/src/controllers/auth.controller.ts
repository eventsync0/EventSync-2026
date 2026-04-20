
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

}
