import { EventCategory } from "../src/config/generated/prisma/enums";
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

    // ──────────────────────────────────────────────
    // ROOMS (30)
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
        "Salle de Réunion 2",
        "Salle de Réunion 3",
        "Salle de Réunion 4",
        "Salle de Réunion 5",
        "Lab Innovation",
        "Espace Co-working",
        "Salle de Formation",
        "Hub Créatif",
        "Studio Création",
        "Salle Polyvalente 1",
        "Salle Polyvalente 2",
        "Salle Polyvalente 3",
        "Salle Polyvalente 4",
        "Salle Polyvalente 5"
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
    // EVENTS (30) — mix passés / en cours / à venir
    // ──────────────────────────────────────────────
    const now = new Date();

    function dayAt(offsetDays: number, hour: number, minute = 0) {
        const d = new Date(now);
        d.setDate(now.getDate() + offsetDays);
        d.setHours(hour, minute, 0, 0);
        return d;
    }

    const eventDefs = [
        // Passés (10 events)
        { title: "DevFest 2025", description: "Le grand rendez-vous des développeurs", category: EventCategory.CONFERENCE, location: "Antananarivo", start: dayAt(-60, 9), end: dayAt(-60, 17) },
        { title: "Cloud Summit 2025", description: "Architectures cloud-native et migration", category: EventCategory.TECHNOLOGY, location: "Lyon", start: dayAt(-55, 9), end: dayAt(-55, 18) },
        { title: "UX Days 2025", description: "Conférence dédiée au design d'expérience utilisateur", category: EventCategory.WORKSHOP, location: "Bruxelles", start: dayAt(-50, 10), end: dayAt(-50, 16) },
        { title: "AI Expo Europe", description: "Exposition sur l'intelligence artificielle", category: EventCategory.CONFERENCE, location: "Paris", start: dayAt(-45, 9), end: dayAt(-44, 18) },
        { title: "Mobile World Congress", description: "Le plus grand salon du mobile", category: EventCategory.BUSINESS, location: "Barcelone", start: dayAt(-40, 9), end: dayAt(-38, 18) },
        { title: "Data Science Summit", description: "Les dernières avancées en data science", category: EventCategory.EDUCATION, location: "Berlin", start: dayAt(-35, 9), end: dayAt(-35, 17) },
        { title: "Cybersecurity Forum", description: "Sécurité informatique et cyberdéfense", category: EventCategory.CONFERENCE, location: "Londres", start: dayAt(-30, 9), end: dayAt(-29, 18) },
        { title: "GreenTech Conference", description: "Technologies durables et écologie", category: EventCategory.TECHNOLOGY, location: "Stockholm", start: dayAt(-25, 9), end: dayAt(-25, 17) },
        { title: "Startup Weekend", description: "Weekend de création de startups", category: EventCategory.WORKSHOP, location: "Lisbonne", start: dayAt(-20, 18), end: dayAt(-18, 22) },
        { title: "Digital Marketing Expo", description: "Marketing digital et stratégies", category: EventCategory.BUSINESS, location: "Amsterdam", start: dayAt(-15, 9), end: dayAt(-15, 18) },
        
        // En cours (3 events)
        { title: "Workshop React Live", description: "Session interactive React", category: EventCategory.WORKSHOP, location: "Zoom", start: new Date(now.getTime() - 2 * 3600000), end: new Date(now.getTime() + 3 * 3600000) },
        { title: "Cloud Native Conference", description: "Kubernetes et microservices", category: EventCategory.TECHNOLOGY, location: "Online", start: new Date(now.getTime() - 1 * 3600000), end: new Date(now.getTime() + 5 * 3600000) },
        { title: "Remote Work Summit", description: "Le futur du travail à distance", category: EventCategory.SOCIAL, location: "Virtual", start: new Date(now.getTime() - 3 * 3600000), end: new Date(now.getTime() + 2 * 3600000) },

        // À venir (17 events)
        { title: "Conférence Tech 2026", description: "IA + Web + Mobile", category: EventCategory.CONFERENCE, location: "Paris", start: dayAt(3, 10), end: dayAt(3, 18) },
        { title: "AI Summit Madagascar", description: "Intelligence artificielle et impact local", category: EventCategory.TECHNOLOGY, location: "Antananarivo", start: dayAt(10, 9), end: dayAt(10, 17) },
        { title: "DevOps Conf", description: "CI/CD, observabilité et infrastructure", category: EventCategory.TECHNOLOGY, location: "Marseille", start: dayAt(18, 9), end: dayAt(19, 18) },
        { title: "Mobile World Tour", description: "Tendances du développement mobile", category: EventCategory.BUSINESS, location: "Genève", start: dayAt(25, 9), end: dayAt(25, 17) },
        { title: "Security & Privacy Forum", description: "Cybersécurité et protection des données", category: EventCategory.CONFERENCE, location: "Bordeaux", start: dayAt(40, 9), end: dayAt(41, 17) },
        { title: "Startup Pitch Night", description: "Soirée de pitchs pour startups", category: EventCategory.SOCIAL, location: "Antananarivo", start: dayAt(55, 18), end: dayAt(55, 22) },
        { title: "Quantum Computing Symposium", description: "L'informatique quantique pour tous", category: EventCategory.CONFERENCE, location: "Zurich", start: dayAt(60, 9), end: dayAt(61, 17) },
        { title: "AR/VR Expo", description: "Réalité augmentée et virtuelle", category: EventCategory.TECHNOLOGY, location: "San Francisco", start: dayAt(65, 9), end: dayAt(67, 18) },
        { title: "Data Privacy Day", description: "Protection des données personnelles", category: EventCategory.EDUCATION, location: "Bruxelles", start: dayAt(70, 9), end: dayAt(70, 17) },
        { title: "Agile Leadership Summit", description: "Leadership agile et transformation", category: EventCategory.BUSINESS, location: "Londres", start: dayAt(75, 9), end: dayAt(76, 18) },
        { title: "Open Source Fest", description: "Célébration de l'open source", category: EventCategory.SOCIAL, location: "Berlin", start: dayAt(80, 10), end: dayAt(80, 22) },
        { title: "Women in Tech", description: "Conférence pour les femmes dans la tech", category: EventCategory.CONFERENCE, location: "Paris", start: dayAt(85, 9), end: dayAt(85, 18) },
        { title: "IoT Solutions Expo", description: "Internet des objets et solutions", category: EventCategory.TECHNOLOGY, location: "Amsterdam", start: dayAt(90, 9), end: dayAt(91, 17) },
        { title: "Sustainability Tech", description: "Technologie pour un avenir durable", category: EventCategory.BUSINESS, location: "Stockholm", start: dayAt(95, 9), end: dayAt(95, 18) },
        { title: "Deep Learning Workshop", description: "Atelier pratique deep learning", category: EventCategory.WORKSHOP, location: "Online", start: dayAt(100, 10), end: dayAt(100, 17) },
        { title: "Blockchain Summit", description: "Blockchain et cryptomonnaies", category: EventCategory.CONFERENCE, location: "Dubai", start: dayAt(105, 9), end: dayAt(107, 18) },
        { title: "Design Thinking Day", description: "Méthodes design thinking", category: EventCategory.WORKSHOP, location: "Barcelone", start: dayAt(110, 9), end: dayAt(110, 17) }
    ];

    const events = [];
    for (const def of eventDefs) {
        const event = await prisma.event.create({
            data: {
                title: def.title,
                description: def.description,
                category: def.category,
                startDate: def.start,
                endDate: def.end,
                location: def.location
            }
        });
        events.push(event);
    }
    console.log(`✅ ${events.length} events créés`);

    // ──────────────────────────────────────────────
    // SESSIONS (30)
    // ──────────────────────────────────────────────
    function plusMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60000);
    }

    const sessionDefs = [];
    
    // Générer 30 sessions avec des speakers variés
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
        "Keynote: Tech for Good",
        "Workshop: Accessibility",
        "Panel: Women in Leadership",
        "Talk: Cloud Security",
        "Workshop: Design Systems",
        "Technical Session: GraphQL",
        "Keynote: Future of Work",
        "Workshop: Agile Methodologies",
        "Panel: Tech Ethics",
        "Talk: Innovation Strategies"
    ];

    for (let i = 0; i < 30; i++) {
        const eventIdx = i % events.length;
        const roomIdx = i % rooms.length;
        const speakerCount = (i % 3) + 1; // 1 à 3 speakers par session
        
        const speakerIndices = [];
        for (let j = 0; j < speakerCount; j++) {
            speakerIndices.push((i + j * 5) % speakers.length);
        }

        const offsetMin = 60 + (i * 15) % 180;
        const durationMin = 60 + (i * 5) % 90;

        sessionDefs.push({
            event: events[eventIdx],
            room: rooms[roomIdx],
            title: sessionTitles[i % sessionTitles.length] + ` ${i + 1}`,
            description: `Session ${i + 1}: Description détaillée de la session sur ${sessionTitles[i % sessionTitles.length].toLowerCase()}`,
            startOffsetMin: offsetMin,
            durationMin: durationMin,
            capacity: 50 + ((i * 7) % 200),
            speakerIdx: speakerIndices
        });
    }

    const sessions = [];
    for (const def of sessionDefs) {
        const sessionStart = plusMinutes(def.event.startDate, def.startOffsetMin);
        const sessionEnd = plusMinutes(sessionStart, def.durationMin);

        const session = await prisma.session.create({
            data: {
                title: def.title,
                description: def.description,
                startTime: sessionStart,
                endTime: sessionEnd,
                capacity: def.capacity,
                eventId: def.event.id,
                roomId: def.room.id,
                speakers: {
                    connect: def.speakerIdx.map((i) => ({ id: speakers[i].id }))
                }
            }
        });
        sessions.push(session);
    }
    console.log(`✅ ${sessions.length} sessions créées`);

    // ──────────────────────────────────────────────
    // QUESTIONS (30)
    // ──────────────────────────────────────────────
    const questionDefs = [];
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
        "Comment former mon équipe ?",
        "Quel budget prévoir ?",
        "Avez-vous des cas d'usage ?",
        "Comment monter en compétence ?",
        "Quelles sont les certifications ?",
        "Comment migrer vers cette solution ?",
        "Quels sont les défis à anticiper ?",
        "Comment assurer la maintenance ?",
        "Quel ROI attendre ?",
        "Comment gérer le changement ?",
        "Quels KPIs suivre ?"
    ];

    const authorNames = [
        "Marie Dupont", "Thomas Martin", "Fanja Rabe", "Hary Andry", "Sophie Laurent",
        "Karim Belkacem", "Tojo Rakoto", "Mialy Razafy", "Jean-Claude Rambo", "Mamy Andriamaro",
        "Anna Schmidt", "Pierre Dubois", "Lena Meyer", "Hugo Leclercq", "Emma Rousseau",
        "Noah Fernandes", "Mia Kowalski", "Liam O'Brien", "Olivia Chen", "Ethan Patel",
        null, null, null, null, null // Quelques questions anonymes
    ];

    for (let i = 0; i < 30; i++) {
        const sessionIdx = i % sessions.length;
        const authorIdx = i % authorNames.length;
        const upvotes = Math.floor(Math.random() * 20) + 1;

        questionDefs.push({
            content: questionContents[i % questionContents.length],
            authorName: authorNames[authorIdx],
            upvotes: upvotes,
            sessionIdx: sessionIdx
        });
    }

    for (const q of questionDefs) {
        await prisma.question.create({
            data: {
                content: q.content,
                authorName: q.authorName,
                upvotes: q.upvotes,
                sessionId: sessions[q.sessionIdx].id
            }
        });
    }
    console.log(`✅ ${questionDefs.length} questions créées`);

    // ──────────────────────────────────────────────
    // Vérification : toutes les sessions ont ≥ 1 speaker
    // ──────────────────────────────────────────────
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

    // ──────────────────────────────────────────────
    // Ajout d'un refresh token pour l'admin
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
    // Statistiques par catégorie
    // ──────────────────────────────────────────────
    const categoryStats = await prisma.event.groupBy({
        by: ['category'],
        _count: true
    });

    console.log("\n📊 Statistiques par catégorie :");
    for (const stat of categoryStats) {
        console.log(`   ${stat.category}: ${stat._count} événement(s)`);
    }

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