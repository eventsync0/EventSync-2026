import { prisma } from "../config/lib/prisma";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already in use");

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "24h") as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        "7d") as jwt.SignOptions["expiresIn"],
    });
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { user, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    try {
      const stored = await prisma.refreshToken.findUnique({ where: { token } });
      if (!stored || stored.expiresAt < new Date()) {
        throw new Error("Refresh token expired or not found");
      }

      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
        userId: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) throw new Error("User not found");

      const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: (process.env.JWT_EXPIRES_IN ||
          "24h") as jwt.SignOptions["expiresIn"],
      });

      return { accessToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  static async logout(token: string) {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }
}
