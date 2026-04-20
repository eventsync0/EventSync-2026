
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/lib/prisma";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
    req: Request,
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
        ) as { userId: string };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        (req as any).userId = user.id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};