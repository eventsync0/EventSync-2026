import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../config/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const SALT_ROUNDS = 10;

export class AuthService {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already in use");

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const options: SignOptions = { expiresIn: "24h" };
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, options);

    return {
      token,
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    };
  }

  generateToken(payload: object, expiresIn: SignOptions["expiresIn"] = "24h"): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  verifyToken(token: string): object | null {
    try {
      return jwt.verify(token, JWT_SECRET) as object;
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();