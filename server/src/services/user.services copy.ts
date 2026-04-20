import bcrypt from "bcrypt";
import { prisma } from "../config/lib/prisma";

const SALT_ROUNDS = 10;

interface UpdateUserDto {
  email?: string;
  password?: string;
}

export class UserService {
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const updateData: { email?: string; passwordHash?: string } = {};

    if (data.email) updateData.email = data.email;
    if (data.password)
      updateData.passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    return prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, createdAt: true },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}