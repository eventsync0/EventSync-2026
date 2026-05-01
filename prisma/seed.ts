import { prisma } from "../src/config/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    console.log('🌱 Début du seeding...');

    // 1. Création du compte admin
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

        console.log("✅ Admin user created with email: admin@eventsync.com");
    }

    // 2. Nettoyage des données existantes
    console.log("🗑️ Nettoyage des données existantes...");
    await prisma.question.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.room.deleteMany({});
    console.log("✅ Nettoyage terminé");

    // 3. Création des salles
    console.log("\n🏢 Création des salles...");

    const roomA = await prisma.room.create({ data: { name: "Grand Amphithéâtre" } });
    const roomB = await prisma.room.create({ data: { name: "Salle de Conférence B" } });
    const roomC = await prisma.room.create({ data: { name: "Studio Live" } });

    console.log(`✅ ${roomA.name}, ${roomB.name}, ${roomC.name} créées`);

    // 4. Événement futur
    const now = new Date();

    const futureStart = new Date(now);
    futureStart.setDate(now.getDate() + 3);
    futureStart.setHours(10, 0, 0, 0);

    const futureEnd = new Date(futureStart);
    futureEnd.setHours(18, 0, 0, 0);

    const event1 = await prisma.event.create({
        data: {
            title: "Conférence Tech 2026",
            description: "Une grande conférence sur les dernières technologies web et mobile.",
            startDate: futureStart,
            endDate: futureEnd,
            location: "Palais des Congrès, Paris"
        }
    });

    console.log(`✅ Événement futur créé: ${event1.title}`);

    // 5. Événement live
    const todayStart = new Date(now);
    todayStart.setHours(now.getHours() - 2, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setHours(now.getHours() + 3, 0, 0, 0);

    const event2 = await prisma.event.create({
        data: {
            title: "Workshop Live : Développement React",
            description: "Atelier pratique en direct.",
            startDate: todayStart,
            endDate: todayEnd,
            location: "En ligne (Zoom)"
        }
    });

    console.log(`✅ Événement en cours créé: ${event2.title}`);

    // 6. Sessions
    console.log("\n📅 Création des sessions...");

    const session1_event1 = await prisma.session.create({
        data: {
            title: "Keynote: L'avenir de l'AI",
            description: "IA en 2026",
            startTime: new Date(futureStart.getTime() + 1 * 60 * 60 * 1000),
            endTime: new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),
            capacity: 200,
            roomId: roomA.id,
            event: { connect: { id: event1.id } }
        }
    });

    const session2_event1 = await prisma.session.create({
        data: {
            title: "Docker & Kubernetes",
            description: "Containerisation",
            startTime: new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),
            endTime: new Date(futureStart.getTime() + 4 * 60 * 60 * 1000),
            capacity: 50,
            roomId: roomB.id,
            event: { connect: { id: event1.id } }
        }
    });

    const session1_event2 = await prisma.session.create({
        data: {
            title: "React 19 Intro",
            description: "Nouveautés React",
            startTime: new Date(todayStart.getTime() + 0.5 * 60 * 60 * 1000),
            endTime: new Date(todayStart.getTime() + 2 * 60 * 60 * 1000),
            capacity: 100,
            roomId: roomC.id,
            event: { connect: { id: event2.id } }
        }
    });

    const session2_event2 = await prisma.session.create({
        data: {
            title: "Live Coding React Hooks",
            description: "Session interactive",
            startTime: new Date(todayStart.getTime() + 2 * 60 * 60 * 1000),
            endTime: new Date(todayStart.getTime() + 3.5 * 60 * 60 * 1000),
            capacity: 80,
            roomId: roomC.id,
            event: { connect: { id: event2.id } }
        }
    });

    console.log(`✅ ${await prisma.session.count()} sessions créées`);

    // 7. Questions
    console.log("\n💬 Création des questions...");

    await prisma.question.createMany({
        data: [
            {
                content: "Quelles sont les prérequis ?",
                authorName: "Marie Dupont",
                upvotes: 12,
                sessionId: session1_event2.id
            },
            {
                content: "React 19 compatible ?",
                authorName: "Thomas Martin",
                upvotes: 8,
                sessionId: session1_event2.id
            }
        ]
    });

    const totalQuestions = await prisma.question.count();
    console.log(`✅ ${totalQuestions} questions créées`);

    // 8. SPEAKERS (PROPRE VERSION SANS RELATION SESSION)
    console.log("\n🎤 Création des speakers...");

    const speakersData = [
    {
        fullName: "Alice Johnson",
        photoUrl: "https://i.pravatar.cc/150?img=1",
        bio: "Experte en IA et Machine Learning.",
        links: { create: [{ platform: "linkedin", url: "https://linkedin.com" }] }
    },
    {
        fullName: "David Kim",
        photoUrl: "https://i.pravatar.cc/150?img=2",
        bio: "Full Stack Developer React/Node.js.",
        links: { create: [{ platform: "github", url: "https://github.com" }] }
    },
    {
        fullName: "Sarah Lopez",
        photoUrl: "https://i.pravatar.cc/150?img=3",
        bio: "DevOps Engineer Docker & Kubernetes.",
        links: { create: [{ platform: "twitter", url: "https://twitter.com" }] }
    },
    {
        fullName: "Michael Brown",
        photoUrl: "https://i.pravatar.cc/150?img=4",
        bio: "Architecte logiciel microservices.",
        links: { create: [{ platform: "website", url: "https://site.com" }] }
    }
];
    for (const speaker of speakersData) {
        await prisma.speaker.create({ data: speaker });
    }

    const totalSpeakers = await prisma.speaker.count();
    console.log(`🎤 Speakers créés: ${totalSpeakers}`);

    // 9. Refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: "seed-refresh-token-demo-" + Date.now(),
            adminId: adminUser.id,
            expiresAt
        }
    });

    console.log("✅ Refresh token créé");

    // 10. Résumé final
    console.log("\n================================");
    console.log("🎉 SEEDING TERMINÉ !");
    console.log("================================");

    console.log(`👤 Admin: ${adminUser.email}`);
    console.log(`🏢 Rooms: ${(await prisma.room.count())}`);
    console.log(`📅 Events: ${(await prisma.event.count())}`);
    console.log(`📅 Sessions: ${(await prisma.session.count())}`);
    console.log(`💬 Questions: ${totalQuestions}`);
    console.log(`🎤 Speakers: ${totalSpeakers}`);
}

main()
    .catch((error) => {
        console.error("❌ Erreur:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });