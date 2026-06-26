import { EventCategory } from "../src/config/generated/prisma/enums";
import { prisma } from "../src/config/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
    console.log("🌱 Début du seeding...");

    // ──────────────────────────────────────────────
    // Nettoyage complet
    // ──────────────────────────────────────────────
    console.log("🗑️ Nettoyage complet...");
    await prisma.question.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.event.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.speakerLink.deleteMany({});
    await prisma.speaker.deleteMany({});
    await prisma.refreshToken.deleteMany({});
    await prisma.admin.deleteMany({});
    console.log("✅ Nettoyage terminé");

    // ──────────────────────────────────────────────
    // ADMIN
    // ──────────────────────────────────────────────
    const passwordHash = await bcrypt.hash("adminpassword123", 10);

    const adminUser = await prisma.admin.create({
        data: {
            name: "Admin",
            email: "admin@eventsync.com",
            passwordHash
        }
    });
    console.log("✅ Admin créé");

    // ──────────────────────────────────────────────
    // ROOMS (20)
    // ──────────────────────────────────────────────
    const roomNames = [
        "Grand Amphithéâtre",
        "Salle de Conférence A",
        "Salle de Conférence B",
        "Studio Live",
        "Salle Atelier 1",
        "Salle Atelier 2",
        "Salle Atelier 3",
        "Salle Atelier 4",
        "Auditorium Nord",
        "Auditorium Sud",
        "Auditorium Est",
        "Auditorium Ouest",
        "Espace Networking",
        "Salle VIP",
        "Studio Podcast",
        "Salle de Réunion 1",
        "Lab Innovation",
        "Hub Créatif",
        "Salle Polyvalente 1",
        "Salle Polyvalente 2"
    ];

    const rooms = [];
    for (const name of roomNames) {
        const room = await prisma.room.create({ data: { name } });
        rooms.push(room);
    }
    console.log(`✅ ${rooms.length} rooms créées`);

    // ──────────────────────────────────────────────
    // SPEAKERS (30)
    // ──────────────────────────────────────────────
    const speakerData = [
        { fullName: "Alice Johnson", bio: "AI Expert & Researcher", platform: "linkedin", url: "https://linkedin.com/in/alice" },
        { fullName: "David Kim", bio: "Fullstack Developer", platform: "github", url: "https://github.com/davidkim" },
        { fullName: "Sarah Lopez", bio: "DevOps Engineer", platform: "twitter", url: "https://twitter.com/sarahlopez" },
        { fullName: "Michael Brown", bio: "Architecte logiciel", platform: "website", url: "https://michaelbrown.dev" },
        { fullName: "Emma Wilson", bio: "Product Manager", platform: "linkedin", url: "https://linkedin.com/in/emmawilson" },
        { fullName: "Lucas Martin", bio: "Lead Mobile Developer", platform: "github", url: "https://github.com/lucasmartin" },
        { fullName: "Nina Petrova", bio: "Data Scientist", platform: "twitter", url: "https://twitter.com/ninapetrova" },
        { fullName: "Jean Dubois", bio: "Cloud Architect", platform: "linkedin", url: "https://linkedin.com/in/jeandubois" },
        { fullName: "Yuki Tanaka", bio: "UX/UI Designer", platform: "website", url: "https://yukitanaka.design" },
        { fullName: "Omar Haddad", bio: "Security Engineer", platform: "github", url: "https://github.com/omarhaddad" },
        { fullName: "Sophie Chen", bio: "ML Engineer", platform: "linkedin", url: "https://linkedin.com/in/sophiechen" },
        { fullName: "Carlos Garcia", bio: "Backend Developer", platform: "github", url: "https://github.com/carlosgarcia" },
        { fullName: "Aisha Patel", bio: "Frontend Architect", platform: "twitter", url: "https://twitter.com/aishapatel" },
        { fullName: "Thomas Mueller", bio: "DevOps Lead", platform: "linkedin", url: "https://linkedin.com/in/thomasmueller" },
        { fullName: "Elena Rodriguez", bio: "Data Engineer", platform: "github", url: "https://github.com/elenarodriguez" },
        { fullName: "James Wilson", bio: "Solutions Architect", platform: "website", url: "https://jameswilson.dev" },
        { fullName: "Marie Laurent", bio: "Tech Lead", platform: "linkedin", url: "https://linkedin.com/in/marielaurent" },
        { fullName: "Kenji Tanaka", bio: "Game Developer", platform: "github", url: "https://github.com/kenjitanaka" },
        { fullName: "Isabella Costa", bio: "UI/UX Designer", platform: "twitter", url: "https://twitter.com/isabellacosta" },
        { fullName: "Ahmed Mansour", bio: "Cloud Specialist", platform: "linkedin", url: "https://linkedin.com/in/ahmedmansour" },
        { fullName: "Olga Petrov", bio: "System Architect", platform: "github", url: "https://github.com/olgapetrov" },
        { fullName: "Pierre Martin", bio: "Web Developer", platform: "website", url: "https://pierremartin.dev" },
        { fullName: "Ling Wei", bio: "AI Researcher", platform: "linkedin", url: "https://linkedin.com/in/lingwei" },
        { fullName: "Marco Rossi", bio: "Mobile Developer", platform: "github", url: "https://github.com/marcorossi" },
        { fullName: "Hannah Schmidt", bio: "Scrum Master", platform: "twitter", url: "https://twitter.com/hannahschmidt" },
        { fullName: "Victor Ng", bio: "Fullstack Engineer", platform: "linkedin", url: "https://linkedin.com/in/victorng" },
        { fullName: "Nadia Belkacem", bio: "Security Analyst", platform: "github", url: "https://github.com/nadiabelkacem" },
        { fullName: "Olivier Dupont", bio: "Software Engineer", platform: "website", url: "https://olivierdupont.dev" },
        { fullName: "Priya Sharma", bio: "Tech Lead", platform: "linkedin", url: "https://linkedin.com/in/priyasharma" },
        { fullName: "Andre Silva", bio: "DevOps Specialist", platform: "github", url: "https://github.com/andresilva" }
    ];

    const speakers = [];
    for (let i = 0; i < speakerData.length; i++) {
        const s = speakerData[i];
        const speaker = await prisma.speaker.create({
            data: {
                fullName: s.fullName,
                photoUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
                bio: s.bio,
                links: {
                    create: [{ platform: s.platform, url: s.url }]
                }
            }
        });
        speakers.push(speaker);
    }
    console.log(`✅ ${speakers.length} speakers créés`);

    // ──────────────────────────────────────────────
    // ÉVÉNEMENTS — Aujourd'hui jusqu'au 15 juillet
    // ──────────────────────────────────────────────
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Date de début: aujourd'hui
    let currentDate = new Date(currentYear, currentMonth, now.getDate());
    // Date de fin: 15 juillet (ou 15 du mois en cours)
    const targetDay = 15;
    let endDate = new Date(currentYear, currentMonth, targetDay);
    
    // Si on est après le 15 du mois, prendre le 15 du mois prochain
    if (now.getDate() > targetDay) {
        endDate = new Date(currentYear, currentMonth + 1, targetDay);
    }
    
    console.log(`📅 Période: du ${currentDate.toLocaleDateString()} au ${endDate.toLocaleDateString()}`);

    const eventDefs = [];
    const eventTypes = [
        EventCategory.CONFERENCE,
        EventCategory.WORKSHOP,
        EventCategory.TECHNOLOGY,
        EventCategory.SEMINAR,
        EventCategory.MEETUP,
        EventCategory.SOCIAL,
        EventCategory.EDUCATION,
        EventCategory.BUSINESS
    ];

    const eventTitles = [
        "Tech Summit",
        "Innovation Day",
        "Developer Conference",
        "AI & Machine Learning",
        "Cloud Computing Expo",
        "Cybersecurity Forum",
        "DevOps Days",
        "Mobile Development",
        "Data Science Symposium",
        "Blockchain Summit",
        "UX/UI Design Conference",
        "Agile Leadership",
        "Digital Transformation",
        "Startup Pitch Day",
        "Open Source Festival",
        "Women in Tech",
        "IoT Solutions Expo",
        "Sustainability Tech",
        "Deep Learning Workshop",
        "Remote Work Summit",
        "Quantum Computing",
        "AR/VR Expo",
        "Data Privacy Day",
        "Agile Leadership Summit",
        "Open Source Fest"
    ];

    const locations = [
        "Paris", "Lyon", "Marseille", "Antananarivo", "Bruxelles",
        "Genève", "Londres", "Berlin", "Amsterdam", "Barcelone",
        "Lisbonne", "Stockholm", "Zurich", "Dubai", "San Francisco",
        "Online", "Virtual", "New York", "Tokyo", "Sydney",
        "Singapour", "Toronto", "Seoul", "Milan", "Madrid"
    ];

    let eventCount = 0;
    let specialEventDate = new Date(currentDate);
    specialEventDate.setDate(specialEventDate.getDate() + 3); // 3 jours après aujourd'hui

    // Parcourir chaque jour de aujourd'hui au 15 du mois
    while (currentDate <= endDate) {
        // Ne pas créer d'événements les samedis et dimanches
        const dayOfWeek = currentDate.getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
        
        // 3 événements par jour (matin, midi, après-midi)
        // Sauf les weekends où on en crée 2
        const eventsPerDay = isWeekend ? 2 : 3;
        
        for (let e = 0; e < eventsPerDay; e++) {
            const titleIndex = eventCount % eventTitles.length;
            const typeIndex = eventCount % eventTypes.length;
            const locationIndex = eventCount % locations.length;
            
            // Heures: 9h, 13h, 17h
            const startHours = [9, 13, 17];
            const startHour = startHours[e % startHours.length];
            const startMinute = (eventCount * 13) % 60;
            
            const startDate = new Date(currentDate);
            startDate.setHours(startHour, startMinute, 0, 0);
            
            // Durée: entre 2 et 4 heures
            const durationHours = 2 + (eventCount % 3);
            const endDateEvent = new Date(startDate);
            endDateEvent.setHours(startDate.getHours() + durationHours);
            
            // Générer une description unique
            const descriptions = [
                "Une conférence incontournable sur les dernières tendances technologiques",
                "Un événement dédié à l'innovation et au partage de connaissances",
                "Rencontrez des experts et découvrez les meilleures pratiques",
                "Une journée d'apprentissage et de networking exceptionnelle",
                "Plongez au cœur des technologies de demain",
                "Un rassemblement unique pour la communauté tech",
                "Partagez, apprenez et innovez avec les meilleurs",
                "Une expérience immersive dans le monde de la technologie",
                "Découvrez les dernières avancées dans le domaine",
                "Un événement interactif pour tous les passionnés"
            ];
            
            // Marquer l'événement spécial (10 sessions)
            const isSpecialEvent = currentDate.getDate() === specialEventDate.getDate() && 
                                  currentDate.getMonth() === specialEventDate.getMonth() &&
                                  e === 1; // Le 2ème événement de la journée
            
            eventDefs.push({
                title: isSpecialEvent ? `🎯 MEGA CONFERENCE - ${eventTitles[titleIndex]}` : `${eventTitles[titleIndex]} ${eventCount + 1}`,
                description: isSpecialEvent ? `🌟 ÉVÉNEMENT SPÉCIAL - ${descriptions[eventCount % descriptions.length]} - Avec 10 sessions exceptionnelles !` : descriptions[eventCount % descriptions.length],
                category: eventTypes[typeIndex],
                location: locations[locationIndex],
                startDate: startDate,
                endDate: endDateEvent,
                isSpecial: isSpecialEvent,
                specialSessions: isSpecialEvent ? 10 : 2
            });
            
            eventCount++;
        }
        
        // Passer au jour suivant
        currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`📅 ${eventDefs.length} événements créés (dont 1 avec 10 sessions)`);

    // Créer les événements
    const events = [];
    let specialEvent = null;
    
    for (const def of eventDefs) {
        const event = await prisma.event.create({
            data: {
                title: def.title,
                description: def.description,
                category: def.category,
                startDate: def.startDate,
                endDate: def.endDate,
                location: def.location
            }
        });
        events.push(event);
        
        if (def.isSpecial) {
            specialEvent = { event, def };
            console.log(`🌟 Événement spécial créé: ${def.title} avec ${def.specialSessions} sessions`);
        }
    }
    console.log(`✅ ${events.length} events créés`);

    // ──────────────────────────────────────────────
    // SESSIONS (2 par événement, 10 pour le spécial)
    // ──────────────────────────────────────────────
    function plusMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60000);
    }

    const sessionTitles = [
        "Keynote: Innovation & Future",
        "Deep Dive: Cloud Architecture",
        "Workshop: React & Next.js",
        "Panel: Future of AI",
        "Masterclass: DevOps",
        "Talk: Mobile Development",
        "Workshop: UI/UX Design",
        "Keynote: Digital Transformation",
        "Technical Session: Microservices",
        "Workshop: Machine Learning",
        "Panel: Cybersecurity Trends",
        "Talk: Blockchain Applications",
        "Workshop: Data Science",
        "Keynote: Leadership in Tech",
        "Technical Session: Kubernetes",
        "Workshop: Web Performance",
        "Panel: Remote Work Culture",
        "Talk: Sustainable Tech",
        "Workshop: Product Management",
        "Technical Session: API Design",
        "Workshop: GraphQL",
        "Panel: Tech Ethics",
        "Talk: Innovation Strategies",
        "Workshop: Docker & Containers",
        "Technical Session: Serverless"
    ];

    const sessionDescriptions = [
        "Une session approfondie sur les sujets clés de la technologie",
        "Atelier pratique avec des exercices concrets",
        "Table ronde avec des experts du domaine",
        "Présentation des dernières innovations",
        "Formation intensive sur les meilleures pratiques",
        "Discussion interactive avec le public",
        "Démonstration en direct des fonctionnalités"
    ];

    const sessions = [];

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const eventStart = event.startDate;
        const isSpecialEvent = specialEvent && event.id === specialEvent.event.id;
        
        // Nombre de sessions: 10 pour le spécial, 2 pour les autres
        const numSessions = isSpecialEvent ? 10 : 2;
        
        // Pour l'événement spécial, on étale les sessions sur toute la journée
        let sessionInterval = 0;
        if (isSpecialEvent) {
            // 10 sessions sur 8 heures (de 9h à 17h)
            sessionInterval = 45; // 45 minutes entre chaque session
        }
        
        for (let s = 0; s < numSessions; s++) {
            const roomIdx = (i + s) % rooms.length;
            const speakerCount = 1 + (s % 2); // 1 ou 2 speakers
            const speakerIndices = [];
            
            for (let sp = 0; sp < speakerCount; sp++) {
                speakerIndices.push((i + s + sp * 7) % speakers.length);
            }
            
            let startOffsetMin;
            let duration;
            
            if (isSpecialEvent) {
                // Sessions espacées de 45 minutes
                startOffsetMin = 45 + (s * sessionInterval);
                duration = 60 + (s % 2) * 15; // 1h ou 1h15
            } else {
                // Sessions normales: 45min et 2h30 après le début
                if (s === 0) {
                    startOffsetMin = 45;
                } else {
                    startOffsetMin = 150 + (s * 30);
                }
                duration = 60 + (s * 15);
            }
            
            // S'assurer que la session ne dépasse pas la fin de l'event
            const maxOffset = (event.endDate.getTime() - eventStart.getTime()) / 60000 - 45;
            const adjustedOffset = Math.min(startOffsetMin, Math.max(30, maxOffset));
            
            const sessionStart = plusMinutes(eventStart, adjustedOffset);
            const sessionEnd = plusMinutes(sessionStart, duration);
            
            // Éviter que la session dépasse l'event
            const finalEnd = sessionEnd > event.endDate ? event.endDate : sessionEnd;
            
            const sessionTitle = isSpecialEvent 
                ? `${sessionTitles[(s) % sessionTitles.length]} - Session ${s + 1}/10`
                : `${sessionTitles[(i + s) % sessionTitles.length]} - Session ${s + 1}`;
            
            const session = await prisma.session.create({
                data: {
                    title: sessionTitle,
                    description: isSpecialEvent 
                        ? `Session ${s + 1}/10 de l'événement spécial - ${sessionDescriptions[(s) % sessionDescriptions.length]}`
                        : sessionDescriptions[(i + s) % sessionDescriptions.length],
                    startTime: sessionStart,
                    endTime: finalEnd,
                    capacity: isSpecialEvent ? 100 + (s * 10) : 50 + ((i + s) * 7) % 200,
                    eventId: event.id,
                    roomId: rooms[roomIdx].id,
                    speakers: {
                        connect: speakerIndices.map((idx) => ({ id: speakers[idx].id }))
                    }
                }
            });
            sessions.push(session);
        }
        
        if (isSpecialEvent) {
            console.log(`🌟 ${numSessions} sessions créées pour l'événement spécial`);
        }
    }
    console.log(`✅ ${sessions.length} sessions créées au total`);

    // ──────────────────────────────────────────────
    // QUESTIONS (2 par session)
    // ──────────────────────────────────────────────
    const questionContents = [
        "Quels sont les prérequis pour cette session ?",
        "Comment puis-je approfondir ce sujet ?",
        "Avez-vous des ressources à partager ?",
        "Quelle est la meilleure pratique recommandée ?",
        "Comment ça fonctionne en production ?",
        "Quelles sont les alternatives ?",
        "Avez-vous un exemple concret ?",
        "Quels outils utilisez-vous ?",
        "Comment gérer les erreurs ?",
        "Quelle est la roadmap ?",
        "Est-ce compatible avec mon stack ?",
        "Comment débuter avec ce framework ?",
        "Avez-vous des slides à partager ?",
        "Comment optimiser les performances ?",
        "Quelles sont les bonnes pratiques ?",
        "Comment gérer la sécurité ?",
        "Quels tests mettre en place ?",
        "Comment évolue cette technologie ?",
        "Quel impact sur la productivité ?",
        "Comment former mon équipe ?"
    ];

    const authorNames = [
        "Marie Dupont", "Thomas Martin", "Fanja Rabe", "Hary Andry", "Sophie Laurent",
        "Karim Belkacem", "Tojo Rakoto", "Mialy Razafy", "Jean-Claude Rambo", "Mamy Andriamaro",
        "Anna Schmidt", "Pierre Dubois", "Lena Meyer", "Hugo Leclercq", "Emma Rousseau",
        null, null, null, null, null // Questions anonymes
    ];

    let questionCount = 0;
    for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i];
        // 2 questions par session
        for (let q = 0; q < 2; q++) {
            const contentIdx = (i + q) % questionContents.length;
            const authorIdx = (i + q) % authorNames.length;
            const upvotes = Math.floor(Math.random() * 20) + 1;

            await prisma.question.create({
                data: {
                    content: questionContents[contentIdx],
                    authorName: authorNames[authorIdx],
                    upvotes: upvotes,
                    sessionId: session.id
                }
            });
            questionCount++;
        }
    }
    console.log(`✅ ${questionCount} questions créées (2 par session)`);

    // ──────────────────────────────────────────────
    // Refresh Token pour l'admin
    // ──────────────────────────────────────────────
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: "seed-refresh-" + Date.now(),
            adminId: adminUser.id,
            expiresAt
        }
    });

    // ──────────────────────────────────────────────
    // Statistiques
    // ──────────────────────────────────────────────
    const categoryStats = await prisma.event.groupBy({
        by: ['category'],
        _count: true
    });

    const liveEvents = await prisma.event.count({
        where: {
            startDate: { lte: new Date() },
            endDate: { gte: new Date() }
        }
    });

    const futureEvents = await prisma.event.count({
        where: {
            startDate: { gt: new Date() }
        }
    });

    const pastEvents = await prisma.event.count({
        where: {
            endDate: { lt: new Date() }
        }
    });

    // Compter les sessions par événement
    const eventsWithSessions = await prisma.event.findMany({
        include: {
            sessions: true
        }
    });

    console.log("\n📊 Statistiques :");
    console.log(`   Événements totaux: ${events.length}`);
    console.log(`   Événements en cours: ${liveEvents}`);
    console.log(`   Événements à venir: ${futureEvents}`);
    console.log(`   Événements passés: ${pastEvents}`);
    console.log(`   Sessions totales: ${sessions.length}`);
    console.log(`   Questions totales: ${questionCount}`);
    
    // Afficher le nombre de sessions par événement
    console.log("\n   Sessions par événement :");
    for (const ev of eventsWithSessions) {
        const isSpecial = ev.title.includes('🎯 MEGA CONFERENCE');
        console.log(`      ${ev.title.substring(0, 40)}... : ${ev.sessions.length} session(s)${isSpecial ? ' 🌟' : ''}`);
    }
    
    console.log("\n   Par catégorie :");
    for (const stat of categoryStats) {
        console.log(`      ${stat.category}: ${stat._count} événement(s)`);
    }

    console.log("\n🎉 SEED TERMINÉ !");
    console.log(`👤 Admin      : ${adminUser.email} / adminpassword123`);
    console.log(`🏢 Rooms      : ${await prisma.room.count()}`);
    console.log(`📅 Events     : ${await prisma.event.count()}`);
    console.log(`🗓️  Sessions   : ${await prisma.session.count()}`);
    console.log(`💬 Questions  : ${await prisma.question.count()}`);
    console.log(`🎤 Speakers   : ${await prisma.speaker.count()}`);
    console.log(`📅 Période    : Aujourd'hui (${new Date().toLocaleDateString()}) jusqu'au ${endDate.toLocaleDateString()}`);
    console.log(`📈 Événements par jour: 3 (2 le weekend)`);
    console.log(`📈 Sessions par événement: 2 (sauf 1 avec 10 sessions 🌟)`);
    console.log(`\n🌟 Événement spécial: ${specialEvent ? specialEvent.def.title : 'Non créé'}`);
    console.log(`   avec 10 sessions sur toute la journée !`);
}

main()
    .catch((e) => {
        console.error("❌ ERROR:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });