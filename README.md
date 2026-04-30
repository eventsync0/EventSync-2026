# EventSync-2026

EventSync is a platform for event management and real-time participant engagement. It replaces static materials (PDFs, printed programs) with a dynamic interface that allows users to easily navigate an event and interact with sessions.

## Backend

## 🚀 Technologies utilisées

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM** (PostgreSQL)
- **JWT** pour l'authentification
- **bcryptjs** pour le hachage des mots de passe
- **CORS** + **dotenv**

---

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (local ou distant)
- npm ou yarn

---

## 🛠 Installation

1. **Clone le repository**

```bash
git clone https://github.com/ChristianMDG/EventSync-2026.git
cd eventsync-backend
```

2. **Installe les dépendances**

```bash
npm install
```

3. **Configure l'environnement**

Copie le fichier `.env.example` (s'il existe) ou crée un fichier `.env` à la racine :

```env
PORT=3001
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://username:password@localhost:5432/eventdb?schema=public"
```

> ⚠️ Remplace les valeurs par tes propres identifiants PostgreSQL.

4. **Génère le client Prisma**

```bash
npm run prisma:generate
npx prisma migrate
npm run seed #to generate the adminUser
```

5. **Lancement du serveur**

```bash
# Mode développement (avec auto-reload)
npm run dev

# Mode production
npm run build
npm start
```

---

## 📁 Structure du projet

```bash
eventsync-backend/
├── src/
│   ├── index.ts                 # Point d'entrée du serveur
│   ├── routes/                  # Routes API
│   ├── controllers/             # Logique métier
│   ├── middlewares/             # Middlewares (auth, validation...)
│   └── utils/                   # Utilitaires
├── config/
│   └── lib/
│       └── prisma.ts            # Configuration Prisma
├── prisma/
│   └── schema.prisma            # Modèle de base de données
├── dist/                        # Code compilé (généré)
├── .env                         # Variables d'environnement
├── nodemon.json
├── tsconfig.json
└── package.json
```

---

## 📜 Scripts disponibles

| Commande                    | Description                              |
|----------------------------|------------------------------------------|
| `npm run dev`              | Lance le serveur en développement        |
| `npm run build`            | Compile TypeScript vers JavaScript       |
| `npm start`                | Lance le serveur en production           |
| `npm run seed`             | créer admin user                         |
| `npm run prisma:generate`  | Génère le client Prisma                  |
| `npx prisma studio`        | Ouvre l'interface Prisma Studio          |
| `npx prisma migrate dev`   | Crée et applique les migrations          |

---

## 🔐 Fonctionnalités actuelles

- Serveur Express configuré avec CORS
- Connexion à PostgreSQL via Prisma
- Chargement sécurisé des variables d'environnement
- Prêt pour l'ajout des routes d'authentification (Register / Login)

---

## 🛠 Prochaines étapes

- Authentification (JWT + bcrypt)
- Gestion des utilisateurs
- Gestion des événements
- Gestion des inscriptions
- Validation des données (Zod ou Joi)
- Tests unitaires

---

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit tes changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvre une Pull Request

---

## Features

- **Dynamic Event Navigation** - Browse events and sessions in real-time
- **Real-time Engagement** - Interact with sessions and other participants
- **Digital-First Experience** - Replace printed programs with an intuitive digital interface
- **Session Management** - Easy access to schedules, speakers, and session details

## Getting Started

### Prerequisites

- Node.js 16+ (or your project's runtime)
- Package manager (npm, yarn, or pnpm)


## Documentation

For detailed documentation, see the [docs][https://docs.google.com/document/d/1wtC66If5fDFQvgpSTOW0_TcaahIKLs5Oq5Fmzd75UtA/edit?usp=sharing]folder.

subject : [subject](/docs/sujet.md)
## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License
This project is license by **MIT**.
