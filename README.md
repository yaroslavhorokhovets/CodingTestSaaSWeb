# Healthcare AI Assistant

Une solution SaaS alimentée par l'IA pour les professionnels de santé, permettant la transcription en temps réel des consultations, la génération automatique de notes médicales structurées (SOAP/DAP), et l'export de données dans différents formats.

## 🎯 Fonctionnalités principales

### 🔐 Authentification et sécurité
- Inscription et connexion sécurisées avec JWT
- Chiffrement AES-256 de toutes les données sensibles
- Conformité HDS (Hébergeur de Données de Santé) et GDPR
- Journalisation complète des accès et actions

### 🎤 Transcription et consultation
- Enregistrement audio haute qualité des consultations
- Transcription en temps réel avec Whisper AI
- Interface intuitive pour démarrer/arrêter l'enregistrement
- Sauvegarde sécurisée des fichiers audio

### 📝 Génération de notes médicales
- Structuration automatique en format SOAP/DAP
- Codage médical automatique (NGAP, CCAM, ICD-10, DSM-5)
- Validation et modification par le praticien
- Templates adaptés par spécialité médicale

### 📄 Génération de documents
- Création automatique d'ordonnances, lettres, rapports
- Templates pré-remplis selon la spécialité
- Prévisualisation avant signature
- Export PDF sécurisé

### 📊 Export et interopérabilité
- Export PDF pour archivage
- Export CSV pour facturation
- Export FHIR pour interopérabilité hospitalière
- Intégration avec logiciels métier (Doctolib, etc.)

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas
- **NextAuth.js** - Authentification

### Backend
- **Prisma** - ORM pour base de données
- **PostgreSQL** - Base de données relationnelle
- **OpenAI API** - Intelligence artificielle
- **bcryptjs** - Hachage des mots de passe
- **crypto-js** - Chiffrement des données

### IA et traitement
- **Whisper** - Transcription audio
- **GPT-4o Mini** - Génération de contenu médical
- **Structured prompts** - Génération de données structurées

## 🚀 Installation et configuration

### Prérequis
- Node.js 18+ 
- PostgreSQL 14+
- Compte OpenAI avec API key

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd healthcare-ai-saas
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp env.example .env.local
```

4. **Configurer les variables d'environnement**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/healthcare_ai_saas"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
JWT_SECRET="your-jwt-secret-key"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
```

5. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

6. **Démarrer le serveur de développement**
```bash
npm run dev
```

## 📱 Interface utilisateur

### Écrans principaux

1. **Authentification**
   - Page de connexion avec validation
   - Inscription avec sélection de spécialité
   - Réinitialisation de mot de passe

2. **Tableau de bord**
   - Statistiques des consultations
   - Actions rapides
   - Activité récente
   - Indicateurs de sécurité

3. **Consultation**
   - Interface d'enregistrement audio
   - Transcription en temps réel
   - Génération de notes SOAP
   - Codage médical automatique

4. **Documents**
   - Sélection du type de document
   - Génération avec IA
   - Édition et validation
   - Signature électronique

5. **Export**
   - Sélection du format (PDF, CSV, FHIR)
   - Configuration du contenu
   - Téléchargement sécurisé

6. **Profil**
   - Informations personnelles
   - Paramètres de sécurité
   - Gestion de l'abonnement

## 🔒 Sécurité et conformité

### Mesures de sécurité
- Chiffrement AES-256 de toutes les données sensibles
- Authentification JWT avec expiration
- Validation stricte des entrées utilisateur
- Journalisation complète des actions
- Protection CSRF et XSS

### Conformité réglementaire
- **HDS** : Hébergement certifié pour données de santé
- **GDPR** : Respect du règlement général sur la protection des données
- **RGPD** : Consentement explicite et droit à l'effacement
- **Déontologie médicale** : Disclaimers et validation obligatoire

### Audit et traçabilité
- Logs de connexion et déconnexion
- Traçabilité des modifications de données
- Historique des exports et accès
- Alertes de sécurité

## 🤖 Intelligence artificielle

### Modèles utilisés
- **Whisper** : Transcription audio multilingue
- **GPT-4o Mini** : Génération de contenu médical structuré
- **Prompts spécialisés** : Adaptation par spécialité médicale

### Limitations et responsabilités
- L'IA génère des suggestions à valider
- Le praticien reste seul responsable des décisions médicales
- Validation obligatoire de tous les contenus générés
- Disclaimers légaux sur l'assistance IA

## 📊 Base de données

### Schéma principal
- **Users** : Professionnels de santé
- **Patients** : Informations patients
- **Consultations** : Consultations et transcriptions
- **Documents** : Documents générés
- **Exports** : Historique des exports
- **AuditLogs** : Traçabilité des actions

### Relations
- Un utilisateur peut avoir plusieurs consultations
- Une consultation peut générer plusieurs documents
- Traçabilité complète via les logs d'audit

## 🚀 Déploiement

### Environnement de production
- Hébergement HDS certifié obligatoire
- Base de données PostgreSQL haute disponibilité
- CDN pour les fichiers statiques
- Monitoring et alertes

### Variables d'environnement production
```env
NODE_ENV=production
DATABASE_URL=<production-database-url>
NEXTAUTH_URL=https://your-domain.com
OPENAI_API_KEY=<production-openai-key>
```

## 📈 Roadmap

### Fonctionnalités futures
- [ ] Intégration avec logiciels métier (Doctolib, Hellodoc)
- [ ] API REST complète pour intégrations tierces
- [ ] Application mobile native
- [ ] Reconnaissance vocale multilingue
- [ ] Analyse prédictive des données de santé
- [ ] Intégration avec systèmes hospitaliers

### Améliorations techniques
- [ ] Cache Redis pour les performances
- [ ] Queue système pour les tâches longues
- [ ] Tests automatisés complets
- [ ] Monitoring avancé avec Prometheus
- [ ] CI/CD avec GitHub Actions

## 📞 Support et contact

Pour toute question technique ou médicale :
- Documentation technique : [Lien vers la documentation]
- Support utilisateur : support@healthcare-ai-saas.com
- Questions médicales : medical@healthcare-ai-saas.com

## ⚖️ Mentions légales

**Important** : Cette application est un outil d'assistance médicale. L'IA génère des suggestions qui doivent être validées par un professionnel de santé qualifié. Le praticien reste seul responsable des décisions médicales et de la qualité des soins prodigués.

---

© 2024 Healthcare AI Assistant. Tous droits réservés.