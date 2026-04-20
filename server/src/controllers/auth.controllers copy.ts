import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const user = await this.authService.register(email, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      res
        .status(400)
        .json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const { token, user } = await this.authService.login(email, password);
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      res
        .status(401)
        .json({ error: error instanceof Error ? error.message : "Login failed" });
    }
  };

  logout = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ message: "Logout successful" });
  };
}