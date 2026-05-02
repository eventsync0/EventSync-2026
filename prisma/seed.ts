import { prisma } from "../src/config/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Début du seeding...");

    // 1. Admin
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

    // 2. Clean DB
    console.log("🗑️ Nettoyage...");
    await prisma.question.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.speaker.deleteMany({});
    console.log("✅ Nettoyage terminé");

    // 3. Rooms
    const roomA = await prisma.room.create({ data: { name: "Grand Amphithéâtre" } });
    const roomB = await prisma.room.create({ data: { name: "Salle de Conférence B" } });
    const roomC = await prisma.room.create({ data: { name: "Studio Live" } });

    // 4. Events
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
    todayStart.setHours(now.getHours() - 2);

    const todayEnd = new Date(now);
    todayEnd.setHours(now.getHours() + 3);

    const event2 = await prisma.event.create({
        data: {
            title: "Workshop React Live",
            description: "Session interactive React",
            startDate: todayStart,
            endDate: todayEnd,
            location: "Zoom"
        }
    });

    // 5. Sessions
    const session1_event1 = await prisma.session.create({
        data: {
            title: "Keynote AI",
            description: "IA 2026",
            startTime: new Date(futureStart.getTime() + 3600000),
            endTime: new Date(futureStart.getTime() + 7200000),
            capacity: 200,
            roomId: roomA.id,
            event: { connect: { id: event1.id } }
        }
    });

    const session2_event1 = await prisma.session.create({
        data: {
            title: "Docker Kubernetes",
            description: "Containerisation",
            startTime: new Date(futureStart.getTime() + 7200000),
            endTime: new Date(futureStart.getTime() + 14400000),
            capacity: 50,
            roomId: roomB.id,
            event: { connect: { id: event1.id } }
        }
    });

    const session1_event2 = await prisma.session.create({
        data: {
            title: "React 19",
            description: "Nouveautés React",
            startTime: new Date(todayStart.getTime() + 1800000),
            endTime: new Date(todayStart.getTime() + 7200000),
            capacity: 100,
            roomId: roomC.id,
            event: { connect: { id: event2.id } }
        }
    });

    const session2_event2 = await prisma.session.create({
        data: {
            title: "React Hooks Live",
            description: "Coding session",
            startTime: new Date(todayStart.getTime() + 7200000),
            endTime: new Date(todayStart.getTime() + 12600000),
            capacity: 80,
            roomId: roomC.id,
            event: { connect: { id: event2.id } }
        }
    });

    console.log("✅ Sessions créées");

    // 6. Questions
    await prisma.question.createMany({
        data: [
            {
                content: "Prérequis ?",
                authorName: "Marie Dupont",
                upvotes: 12,
                sessionId: session1_event2.id
            },
            {
                content: "React 19 stable ?",
                authorName: "Thomas Martin",
                upvotes: 8,
                sessionId: session1_event2.id
            }
        ]
    });

    // 7. SPEAKERS
    console.log("\n🎤 Création speakers...");

    const alice = await prisma.speaker.create({
        data: {
            fullName: "Alice Johnson",
            photoUrl: "https://i.pravatar.cc/150?img=1",
            bio: "AI Expert",
            links: {
                create: [{ platform: "linkedin", url: "https://linkedin.com" }]
            }
        }
    });

    const david = await prisma.speaker.create({
        data: {
            fullName: "David Kim",
            photoUrl: "https://i.pravatar.cc/150?img=2",
            bio: "Fullstack Dev",
            links: {
                create: [{ platform: "github", url: "https://github.com" }]
            }
        }
    });

    const sarah = await prisma.speaker.create({
        data: {
            fullName: "Sarah Lopez",
            photoUrl: "https://i.pravatar.cc/150?img=3",
            bio: "DevOps",
            links: {
                create: [{ platform: "twitter", url: "https://twitter.com" }]
            }
        }
    });

    const michael = await prisma.speaker.create({
        data: {
            fullName: "Michael Brown",
            photoUrl: "https://i.pravatar.cc/150?img=4",
            bio: "Architecte logiciel",
            links: {
                create: [{ platform: "website", url: "https://site.com" }]
            }
        }
    });

    console.log("✅ Speakers créés");

    // 8. LIAISON SPEAKERS ↔ SESSIONS
    console.log("\n🔗 Liaison speakers ↔ sessions...");

    await prisma.session.update({
        where: { id: session1_event1.id },
        data: {
            speakers: { connect: [{ id: alice.id }, { id: david.id }] }
        }
    });

    await prisma.session.update({
        where: { id: session2_event1.id },
        data: {
            speakers: { connect: [{ id: sarah.id }] }
        }
    });

    await prisma.session.update({
        where: { id: session1_event2.id },
        data: {
            speakers: { connect: [{ id: david.id }, { id: michael.id }] }
        }
    });

    await prisma.session.update({
        where: { id: session2_event2.id },
        data: {
            speakers: {
                connect: [
                    { id: alice.id },
                    { id: sarah.id },
                    { id: michael.id }
                ]
            }
        }
    });

    console.log("✅ Relations speakers ↔ sessions OK");

    // 9. Vérification obligatoire
    const check = await prisma.session.findMany({
        include: { speakers: true }
    });

    const invalid = check.filter(s => s.speakers.length === 0);

    if (invalid.length > 0) {
        console.log("❌ Sessions sans speakers :", invalid);
    } else {
        console.log("✅ Toutes les sessions ont au moins 1 speaker");
    }

    // 10. Refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: "seed-refresh-" + Date.now(),
            adminId: adminUser.id,
            expiresAt
        }
    });

    // 11. Résumé
    console.log("\n🎉 SEED TERMINÉ !");
    console.log(`👤 Admin: ${adminUser.email}`);
    console.log(`🏢 Rooms: ${await prisma.room.count()}`);
    console.log(`📅 Events: ${await prisma.event.count()}`);
    console.log(`📅 Sessions: ${await prisma.session.count()}`);
    console.log(`💬 Questions: ${await prisma.question.count()}`);
    console.log(`🎤 Speakers: ${await prisma.speaker.count()}`);
}

main()
    .catch((e) => {
        console.error("❌ ERROR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });