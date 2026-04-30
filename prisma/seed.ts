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

    // 2. Nettoyage des données existantes (dans l'ordre pour respecter les relations)
    console.log("🗑️ Nettoyage des données existantes...");
    await prisma.question.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.room.deleteMany({});
    console.log("✅ Nettoyage terminé");

    // 3. Création des salles (Rooms)
    console.log("\n🏢 Création des salles...");
    const roomA = await prisma.room.create({
        data: {
            name: "Grand Amphithéâtre"
        }
    });
    const roomB = await prisma.room.create({
        data: {
            name: "Salle de Conférence B"
        }
    });
    const roomC = await prisma.room.create({
        data: {
            name: "Studio Live"
        }
    });
    console.log(`✅ ${roomA.name}, ${roomB.name}, ${roomC.name} créées`);

    // 4. Événement 1 : Dates futures (dans 3 jours)
    const now = new Date();
    const futureStart = new Date(now);
    futureStart.setDate(now.getDate() + 3);
    futureStart.setHours(10, 0, 0, 0);
    
    const futureEnd = new Date(futureStart);
    futureEnd.setHours(18, 0, 0, 0);

    const event1 = await prisma.event.create({
        data: {
            title: "Conférence Tech 2026",
            description: "Une grande conférence sur les dernières technologies web et mobile. Au programme : AI, Cloud, DevOps et plus encore !",
            startDate: futureStart,
            endDate: futureEnd,
            location: "Palais des Congrès, Paris"
        }
    });
    console.log(`✅ Événement futur créé: ${event1.title}`);

    // 5. Événement 2 : En cours aujourd'hui (pour tester le live)
    const todayStart = new Date(now);
    todayStart.setHours(now.getHours() - 2, 0, 0, 0); // Commencé il y a 2 heures
    
    const todayEnd = new Date(now);
    todayEnd.setHours(now.getHours() + 3, 0, 0, 0); // Se termine dans 3 heures

    const event2 = await prisma.event.create({
        data: {
            title: "Workshop Live : Développement React",
            description: "Atelier pratique en direct ! Rejoignez-nous pour apprendre React Hooks, Context API et les bonnes pratiques. Événement interactif avec des exercices en temps réel.",
            startDate: todayStart,
            endDate: todayEnd,
            location: "En ligne (Zoom) - https://zoom.xyz/live"
        }
    });
    console.log(`✅ Événement en cours créé: ${event2.title}`);

    // 6. Création des sessions pour chaque événement
    console.log("\n📅 Création des sessions...");

    // Sessions pour l'événement futur
    const session1_event1 = await prisma.session.create({
        data: {
            title: "Keynote: L'avenir de l'AI",
            description: "Présentation principale sur les tendances de l'intelligence artificielle en 2026",
            startTime: new Date(futureStart.getTime() + 1 * 60 * 60 * 1000), // +1 heure
            endTime: new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),   // +2 heures
            capacity: 200,
            roomId: roomA.id,
            event: {
                connect: { id: event1.id }
            }
        }
    });

    const session2_event1 = await prisma.session.create({
        data: {
            title: "Atelier Docker & Kubernetes",
            description: "Atelier pratique sur la containerisation et l'orchestration",
            startTime: new Date(futureStart.getTime() + 2 * 60 * 60 * 1000),
            endTime: new Date(futureStart.getTime() + 4 * 60 * 60 * 1000),
            capacity: 50,
            roomId: roomB.id,
            event: {
                connect: { id: event1.id }
            }
        }
    });

    // Sessions pour l'événement en cours
    const session1_event2 = await prisma.session.create({
        data: {
            title: "Introduction à React 19",
            description: "Découvrez les nouvelles fonctionnalités de React 19",
            startTime: new Date(todayStart.getTime() + 0.5 * 60 * 60 * 1000),
            endTime: new Date(todayStart.getTime() + 2 * 60 * 60 * 1000),
            capacity: 100,
            roomId: roomC.id,
            event: {
                connect: { id: event2.id }
            }
        }
    });

    const session2_event2 = await prisma.session.create({
        data: {
            title: "Live Coding: React Hooks Avancés",
            description: "Session interactive de live coding sur les hooks avancés",
            startTime: new Date(todayStart.getTime() + 2 * 60 * 60 * 1000),
            endTime: new Date(todayStart.getTime() + 3.5 * 60 * 60 * 1000),
            capacity: 80,
            roomId: roomC.id,
            event: {
                connect: { id: event2.id }
            }
        }
    });

    console.log(`✅ ${await prisma.session.count()} sessions créées`);

    // 7. Création de questions pour les sessions (pour tester les interactions)
    console.log("\n💬 Création des questions...");

    // Questions pour la session en cours (événement 2, session 1)
    await prisma.question.createMany({
        data: [
            {
                content: "Quelles sont les prérequis pour suivre ce workshop ?",
                authorName: "Marie Dupont",
                upvotes: 12,
                sessionId: session1_event2.id
            },
            {
                content: "Est-ce que React 19 est compatible avec les projets existants ?",
                authorName: "Thomas Martin",
                upvotes: 8,
                sessionId: session1_event2.id
            },
            {
                content: "Avez-vous des ressources pour continuer à apprendre après le workshop ?",
                authorName: "Sophie Bernard",
                upvotes: 5,
                sessionId: session1_event2.id
            },
            {
                content: "Comment gérer le state global avec React 19 ?",
                authorName: "Lucas Petit",
                upvotes: 3,
                sessionId: session1_event2.id
            }
        ]
    });

    // Questions pour la deuxième session de l'événement en cours
    await prisma.question.createMany({
        data: [
            {
                content: "Pourriez-vous expliquer la différence entre useMemo et useCallback ?",
                authorName: "Emma Richard",
                upvotes: 15,
                sessionId: session2_event2.id
            },
            {
                content: "Quelles sont les bonnes pratiques pour les custom hooks ?",
                authorName: "Nicolas Dubois",
                upvotes: 7,
                sessionId: session2_event2.id
            }
        ]
    });

    // Questions pour l'événement futur
    await prisma.question.createMany({
        data: [
            {
                content: "Y aura-t-il du temps pour le networking ?",
                authorName: "Julie Moreau",
                upvotes: 24,
                sessionId: session1_event1.id
            },
            {
                content: "Les présentations seront-elles enregistrées ?",
                authorName: "Pierre Lambert",
                upvotes: 18,
                sessionId: session1_event1.id
            }
        ]
    });

    const totalQuestions = await prisma.question.count();
    console.log(`✅ ${totalQuestions} questions créées`);

    // 8. Création d'un refresh token pour l'admin (optionnel)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

    await prisma.refreshToken.create({
        data: {
            token: "seed-refresh-token-demo-" + Date.now(),
            adminId: adminUser.id,
            expiresAt: expiresAt
        }
    });
    console.log("✅ Refresh token créé pour l'admin");

    // 9. Résumé final
    console.log("\n" + "=".repeat(50));
    console.log("🎉 SEEDING TERMINÉ AVEC SUCCÈS !");
    console.log("=".repeat(50));
    console.log("\n📋 RÉCAPITULATIF:");
    console.log(`\n👤 UTILISATEURS:`);
    console.log(`   - Admin: ${adminUser.email} / adminpassword123`);
    console.log(`   - ID: ${adminUser.id}`);
    
    console.log(`\n🏢 SALLES:`);
    const rooms = await prisma.room.findMany();
    rooms.forEach(room => {
        console.log(`   - ${room.name} (${room.id})`);
    });
    
    console.log(`\n📅 ÉVÉNEMENTS:`);
    console.log(`   1. ${event1.title} (FUTUR)`);
    console.log(`      📍 ${event1.location}`);
    console.log(`      🕒 ${event1.startDate.toLocaleString()} - ${event1.endDate.toLocaleString()}`);
    console.log(`   2. ${event2.title} (EN COURS - LIVE)`);
    console.log(`      📍 ${event2.location}`);
    console.log(`      🕒 ${event2.startDate.toLocaleString()} - ${event2.endDate.toLocaleString()}`);
    
    console.log(`\n🎯 SESSIONS:`);
    const sessions = await prisma.session.findMany({
        include: {
            room: true,
            event: true
        }
    });
    sessions.forEach(session => {
        const eventTitle = session.event[0]?.title || "No event";
        console.log(`   - "${session.title}" (${session.room.name}) - ${eventTitle}`);
        console.log(`     🕒 ${session.startTime.toLocaleTimeString()} - ${session.endTime.toLocaleTimeString()}`);
        console.log(`     👥 Capacité: ${session.capacity} places`);
    });
    
    console.log(`\n💬 STATISTIQUES:`);
    console.log(`   - Total sessions: ${sessions.length}`);
    console.log(`   - Total questions: ${totalQuestions}`);
    console.log(`   - Upvotes total: ${(await prisma.question.aggregate({ _sum: { upvotes: true } }))._sum.upvotes || 0}`);
    
    console.log("\n✨ Vous pouvez maintenant tester votre application !");
    console.log("💡 Pour tester le live: connectez-vous à l'événement 'Workshop Live : Développement React'");
}

main()
    .catch((error) => {
        console.error("\n❌ Erreur lors du seeding:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });