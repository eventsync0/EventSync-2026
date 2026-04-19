# EventSync

![](https://media0.giphy.com/media/v1.Y2lkPTc5NDFmZGM2M2Q5endpZGU1MWlvbXgxazA4ajIyM2ZlejUxeHJyeWN3dXU4bjlnciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ACJuukdjBl65FwUFzT/giphy.gif)

# 📄 Spécifications Fonctionnelles — EventSync

## 1. Introduction

### 1.1 Objectif

EventSync est une plateforme de gestion d’événements et d’engagement des participants en temps réel. Elle remplace les supports statiques (PDF, programmes papier) par une interface dynamique permettant de naviguer facilement dans un événement et d’interagir avec les sessions.

### 1.2 Périmètre

La plateforme permet :

- La gestion complète d’événements par des organisateurs
- La consultation publique des événements et de leur planning
- L’interaction en direct via un système de questions/réponses pendant les sessions

---

## 2. Rôles Utilisateurs

### 2.1 Organisateur (Admin)

Accès sécurisé via authentification.

**Capacités :**

- Créer, modifier et supprimer des événements
- Gérer les sessions (création, modification)
- Assigner des intervenants aux sessions
- Définir les salles et les horaires
- Gérer les profils des intervenants

---

### 2.2 Participant (Accès Public)

Accès libre sans authentification.

**Capacités :**

- Consulter les événements
- Visualiser le planning global
- Identifier les sessions en cours (live)
- Accéder aux détails d’une session
- Poser des questions pendant une session live
- Upvoter des questions
- Ajouter des sessions en favoris

---

### 2.3 Intervenant (Speaker)

Aucun système d’authentification spécifique.

**Capacités :**

- Accéder à leur page publique
- Consulter les sessions auxquelles ils participent
- Visualiser les questions posées sur leurs sessions

---

## 3. Entités Fonctionnelles

### 3.1 Événement

Représente un événement (conférence, workshop, etc.)

**Attributs :**

- Titre
- Description
- Date de début
- Date de fin
- Lieu
- Liste des sessions

---

### 3.2 Session

Représente une intervention ou activité dans un événement.

**Attributs :**

- Titre
- Description
- Heure de début
- Heure de fin
- Salle
- Capacité (valeur informative)
- Liste des intervenants
- Liste des questions

---

### 3.3 Salle (Room)

Représente un lieu physique ou logique.

**Attributs :**

- Nom

Les salles sont utilisées comme **critère de filtrage** pour afficher les sessions associées.

---

### 3.4 Intervenant (Speaker)

**Attributs :**

- Nom complet
- Photo de profil
- Biographie (texte)
- Liens externes (réseaux sociaux, site web)
- Liste des sessions associées

Chaque intervenant dispose d’une **page publique accessible à tous**.

---

### 3.5 Question

Représente une question posée par un participant.

**Attributs :**

- Contenu (texte)
- Nom (optionnel, pour permettre l’anonymat)
- Nombre de upvotes
- Session associée
- Date/heure de création

---

## 4. Fonctionnalités

---

## 4.1 Consultation d’un Événement

### Description

Page publique permettant d’accéder aux informations d’un événement.

### Fonctionnalités

- Affichage :
    - Titre
    - Description
    - Dates
- Liste des sessions
- Mise en avant des sessions en cours (live)

---

## 4.2 Planning Multi-Track (Vue Globale)

### Description

Affichage des sessions sous forme de grille temporelle.

### Fonctionnalités

- Organisation par horaires
- Affichage simultané des sessions selon les salles
- Sessions en parallèle visibles côte à côte

### Informations affichées

- Titre
- Heure
- Salle
- Intervenants

### Actions possibles

- Accéder au détail d’une session
- Ajouter une session en favori

---

## 4.3 Détection des Sessions "Live"

### Description

Identification automatique des sessions en cours.

### Règle

Une session est considérée comme "live" si :

- L’heure actuelle est comprise entre l’heure de début et l’heure de fin

### Affichage

- Badge "Live"
- Visible dans :
    - Page événement
    - Planning global
    - Vue par salle

---

## 4.4 Page Détail d’une Session

### Contenu

- Titre
- Description
- Horaires
- Salle
- Capacité (informative)
- Liste des intervenants (avec lien vers leur page)
- Section des questions

---

## 4.5 Système de Questions / Réponses

### Visibilité

- Accessible uniquement lorsque la session est en cours (live)
- Non visible avant le début de la session

### Fonctionnalités

### Soumission d’une question

- Champ texte obligatoire
- Champ nom optionnel (anonyme possible)

### Consultation des questions

- Liste des questions associées à la session
- Tri par nombre de upvotes (ordre décroissant)

### Upvote

- Les participants peuvent upvoter les questions existantes
- Chaque upvote incrémente un compteur

---

## 4.6 Pages Intervenants

### Description

Pages générées automatiquement et accessibles publiquement.

### Contenu

- Photo de profil
- Nom
- Biographie
- Liens externes
- Liste des sessions associées

---

## 4.7 Vue Planning par Salle

### Description

Affichage des sessions filtrées par salle.

### Fonctionnalités

- Liste chronologique des sessions pour une salle donnée
- Affichage pour chaque session :
    - Heure
    - Titre
    - Intervenants
    - Badge "Live" si la session est en cours

---

## 4.8 Favoris (Itinéraire Personnel)

### Description

Permet aux participants de créer une sélection personnelle de sessions.

### Fonctionnalités

- Ajouter une session en favori
- Retirer une session des favoris
- Consulter la liste des sessions favorites

Stockage réalisé côté navigateur (local).

---

## 5. Règles de Gestion

- Une session :
    - Appartient à un seul événement
    - Est associée à une seule salle
    - Possède au moins un intervenant
- Une question :
    - Est associée à une session
    - Ne peut être créée que lorsque la session est live
    - Peut être anonyme
- Les upvotes :
    - Sont cumulés via un compteur numérique
    - Ne sont pas limités dans cette version

---

## 6. Contraintes

- Authentification requise uniquement pour les organisateurs (admin)
- Accès public pour les participants et les pages intervenants
- Absence de modération des questions (version initiale)
- Capacité des sessions non contraignante (informatif uniquement)
- Absence de système d’inscription aux sessions

---

## 7. Évolutions Futures

- Authentification des participants et intervenants
- Modération des questions
- Notifications en temps réel
- Système d’inscription avec gestion de capacité
- Statistiques et analytics pour les organisateurs

---

## 8. Critères de Succès

- Les participants peuvent :
    - Identifier rapidement les sessions en cours
    - Naviguer facilement dans le planning
    - Interagir avec les sessions en direct
- Les organisateurs peuvent :
    - Gérer efficacement des événements complexes
- Les intervenants bénéficient :
    - D’une page publique professionnelle
    - D’une visibilité sur les interactions liées à leurs sessions