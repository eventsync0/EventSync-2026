// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/lib/prisma";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
    userId?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role?: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "your-secret-key"
        ) as { adminId: string; email: string };

        const user = await prisma.admin.findUnique({
            where: { id: decoded.adminId },
            select: {
                id: true,
                email: true,
                name: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: "Admin not found" });
        }

        // Attacher l'utilisateur à la requête
        req.userId = user.id;
        req.user = user;
        
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token expired" });
        }
        res.status(401).json({ error: "Authentication failed" });
    }
};

export const adminMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const isAdmin = req.user.email === "admin@eventsync.com" || req.user.role === "admin";
        
        if (!isAdmin) {
            return res.status(403).json({ error: "Access denied. Admin only." });
        }

        next();
    } catch (error) {
        res.status(403).json({ error: "Admin verification failed" });
    }
};