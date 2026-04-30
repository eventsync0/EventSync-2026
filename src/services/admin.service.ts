import { prisma } from "../config/lib/prisma";
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";

export class AdminService {

  static async login(email: string, password: string) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        "24h") as jwt.SignOptions["expiresIn"],
    });

    const refreshToken = jwt.sign({ adminId: admin.id }, JWT_REFRESH_SECRET, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        "7d") as jwt.SignOptions["expiresIn"],
    });
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        adminId: admin.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return { admin, accessToken, refreshToken };
  }

  static async refreshToken(token: string) {
    try {
      const stored = await prisma.refreshToken.findUnique({ where: { token } });
      if (!stored || stored.expiresAt < new Date()) {
        throw new Error("Refresh token expired or not found");
      }

      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as {
        adminId: string;
      };

      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId },
      });
      if (!admin) throw new Error("Admin not found");

      const accessToken = jwt.sign({ adminId: admin.id }, JWT_SECRET, {
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

  static async me(adminId: string) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    if (!admin) throw new Error("Admin not found");
    return admin;
  }
}
