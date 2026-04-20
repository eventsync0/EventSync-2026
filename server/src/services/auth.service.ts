import { prisma } from "../config/lib/prisma";
import bcrypt from "bcrypt"
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export class AuthService {
    async register(name:string, email: string, password: string) {
       const existing = await prisma.user.findUnique({ where: { email } });
       if (existing) throw new Error("Email already in use");

       const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

       return prisma.user.create({
         data: { name, email, passwordHash },
         select: { id: true, name: true, email: true, createdAt: true },
       });
    }

    static async login(email: string, password: string) {
        throw new Error("Method not implemented.");
    }

    static generateToken(payload: object, expiresIn: string = process.env.JWT_EXPIRES_IN || "24h"): string {
        throw new Error("Method not implemented.");
    }

    static verifyToken(token: string): object | null {
        throw new Error("Method not implemented.");
    }
    static refreshToken(token: string): string {
        throw new Error("Method not implemented.");
    }
}