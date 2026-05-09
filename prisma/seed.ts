import { prisma } from "../src/config/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Début du seeding...");

    const existing = await prisma.admin.findUnique({
        where: { email: "admin@eventsync.com" }
    });

    let adminUser;

    if (existing) {
        console.log("⚠️ Admin already exists");
        adminUser = existing;
    } else {
        const passwordHash = await bcrypt.hash("adminpassword123", 10);

        adminUser = await prisma.admin.create({
            data: {
                name: "Admin",
                email: "admin@eventsync.com",
                passwordHash
            }
        });

        console.log("✅ Admin créé");
    }

    console.log("🗑️ Nettoyage...");
    await prisma.question.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.speakerLink.deleteMany({});
    await prisma.speaker.deleteMany({});
    await prisma.refreshToken.deleteMany({ where: { adminId: adminUser.id } });
    console.log("✅ Nettoyage terminé");

    const roomA = await prisma.room.create({ data: { name: "Grand Amphithéâtre" } });
    const roomB = await prisma.room.create({ data: { name: "Salle de Conférence B" } });
    const roomC = await prisma.room.create({ data: { name: "Studio Live" } });

    console.log("✅ Rooms créées");


    const now = new Date();

    const futureStart = new Date(now);
    futureStart.setDate(now.getDate() + 3);
    futureStart.setHours(10, 0, 0, 0);

    const futureEnd = new Date(futureStart);
    futureEnd.setHours(18, 0, 0, 0);

    const event1 = await prisma.event.create({
        data: {
            title: "Conférence Tech 2026",
            description: "IA + Web + Mobile",
            startDate: futureStart,
            endDate: futureEnd,
            location: "Paris"
        }
    });

    const todayStart = new Date(now);
    todayStart.setHours(now.getHours() - 2, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(now.getHours() + 3, 0, 0, 0);

    const event2 = await prisma.event.create({
        data: {
            title: "Workshop React Live",
            description: "Session interactive React",
            startDate: todayStart,
            endDate: todayEnd,
            location: "Zoom"
        }
    });

    console.log("✅ Events créés");

    console.log("\n🎤 Création speakers...");

    const alice = await prisma.speaker.create({
        data: {
            fullName: "Alice Johnson",
            photoUrl: "https://i.pravatar.cc/150?img=1",
            bio: "AI Expert & Researcher",
            links: {
                create: [{ platform: "linkedin", url: "https://linkedin.com/in/alice" }]
            }
        }
    });

    const david = await prisma.speaker.create({
        data: {
            fullName: "David Kim",
            photoUrl: "https://i.pravatar.cc/150?img=2",
            bio: "Fullstack Developer",
            links: {
                create: [{ platform: "github", url: "https://github.com/davidkim" }]
            }
        }
    });

    const sarah = await prisma.speaker.create({
        data: {
            fullName: "Sarah Lopez",
            photoUrl: "https://i.pravatar.cc/150?img=3",
            bio: "DevOps Engineer",
            links: {
                create: [{ platform: "twitter", url: "https://twitter.com/sarahlopez" }]
            }
        }
    });

    const michael = await prisma.speaker.create({
        data: {
            fullName: "Michael Brown",
            photoUrl: "https://i.pravatar.cc/150?img=4",
            bio: "Architecte logiciel",
            links: {
                create: [{ platform: "website", url: "https://michaelbrown.dev" }]
            }
        }
    });

    console.log("✅ Speakers créés");

    console.log("\n📅 Création sessions...");

    const session1_event1 = await prisma.session.create({
        data: {
            title: "Keynote AI",
            description: "L'IA en 2026 : où en sommes-nous ?",
            startTime: new Date(futureStart.getTime() + 3600000),
            endTime: new Date(futureStart.getTime() + 7200000),
            capacity: 200,
            eventId: event1.id,
            roomId: roomA.id,
            speakers: {
                connect: [{ id: alice.id }, { id: david.id }]
            }
        }
    });

    const session2_event1 = await prisma.session.create({
        data: {
            title: "Docker & Kubernetes",
            description: "Containerisation avancée",
            startTime: new Date(futureStart.getTime() + 7200000),
            endTime: new Date(futureStart.getTime() + 14400000),
            capacity: 50,
            eventId: event1.id,
            roomId: roomB.id,
            speakers: {
                connect: [{ id: sarah.id }]
            }
        }
    });

    const session1_event2 = await prisma.session.create({
        data: {
            title: "React 19 — Nouveautés",
            description: "Tour d'horizon des nouveautés React 19",
            startTime: new Date(todayStart.getTime() + 1800000),
            endTime: new Date(todayStart.getTime() + 7200000),
            capacity: 100,
            eventId: event2.id,
            roomId: roomC.id,
            speakers: {
                connect: [{ id: david.id }, { id: michael.id }]
            }
        }
    });

    const session2_event2 = await prisma.session.create({
        data: {
            title: "React Hooks Live Coding",
            description: "Session de code en direct",
            startTime: new Date(todayStart.getTime() + 7200000),
            endTime: new Date(todayStart.getTime() + 12600000),
            capacity: 80,
            eventId: event2.id,
            roomId: roomC.id,
            speakers: {
                connect: [{ id: alice.id }, { id: sarah.id }, { id: michael.id }]
            }
        }
    });

    console.log("✅ Sessions créées");

    console.log("\n💬 Création questions...");

    await prisma.question.createMany({
        data: [
            {
                content: "Quels sont les prérequis pour cette session ?",
                authorName: "Marie Dupont",
                upvotes: 12,
                sessionId: session1_event2.id
            },
            {
                content: "React 19 est-il stable en production ?",
                authorName: "Thomas Martin",
                upvotes: 8,
                sessionId: session1_event2.id
            },
            {
                content: "Quelle différence avec React 18 ?",
                authorName: null,
                upvotes: 5,
                sessionId: session1_event2.id
            }
        ]
    });

    console.log("✅ Questions créées");

    const allSessions = await prisma.session.findMany({
        include: { speakers: true }
    });

    const invalid = allSessions.filter(s => s.speakers.length === 0);

    if (invalid.length > 0) {
        console.error("❌ Sessions sans speakers :", invalid.map(s => s.title));
        process.exit(1);
    } else {
        console.log("✅ Toutes les sessions ont au moins 1 speaker");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: "seed-refresh-" + Date.now(),
            adminId: adminUser.id,
            expiresAt
        }
    });

    console.log("\n🎉 SEED TERMINÉ !");
    console.log(`👤 Admin      : ${adminUser.email} / adminpassword123`);
    console.log(`🏢 Rooms      : ${await prisma.room.count()}`);
    console.log(`📅 Events     : ${await prisma.event.count()}`);
    console.log(`🗓️  Sessions   : ${await prisma.session.count()}`);
    console.log(`💬 Questions  : ${await prisma.question.count()}`);
    console.log(`🎤 Speakers   : ${await prisma.speaker.count()}`);
}

main()
    .catch((e) => {
        console.error("❌ ERROR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });