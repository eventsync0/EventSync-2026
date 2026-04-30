import { prisma } from "../src/config/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    const existing = await prisma.user.findUnique({
        where: { email: "admin@eventsync.com" }
    });

    if (existing) {
        console.log("Admin already exists");
        return;
    }

    const passwordHash = await bcrypt.hash("adminpassword123", 10);

    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@eventsync.com",
            passwordHash
        }
    });

    console.log("Admin user created with email: admin@eventsync.com");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())