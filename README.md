# Linkstech — Site institutionnel

Site full-stack de Linkstech développé avec Next.js. Il présente les activités de construction, d’ingénierie et de technologie de l’entreprise en RDC, au Kenya, au Canada et à l’international.

## Technologies

- Next.js 16 (App Router)
- React 19
- API Route Next.js pour les demandes de contact
- Lucide React pour les icônes
- CSS responsive sans framework

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrez ensuite `http://localhost:3000`.

## Production

```bash
npm run build
npm start
```

Le fichier `server.js` démarre Next.js sur le port fourni par l’hébergeur (`PORT`) et convient à **cPanel / Passenger**.

## Installation sur cPanel

1. Dans cPanel, ouvrez **Setup Node.js App** et créez une application en mode `Production` avec Node.js 20 ou 22.
2. Choisissez un dossier d’application, par exemple `linkstech`.
3. Indiquez `server.js` comme fichier de démarrage.
4. Chargez le contenu de l’archive dans ce dossier.
5. Dans le terminal cPanel, exécutez :

```bash
cd ~/linkstech
npm install
npm run build
```

6. Ajoutez les variables `WHATSAPP_NUMBER=243976459970` et `CONTACT_EMAIL=contact@linksmartec.com` dans l’interface Node.js.
7. Cliquez sur **Restart Application**.

Le domaine ou sous-domaine sélectionné lors de la création de l’application affichera alors le site.

## Formulaire de contact

Le formulaire appelle `POST /api/contact`. Le serveur :

1. valide et nettoie les données ;
2. limite les soumissions abusives ;
3. archive la demande dans `data/contact-requests.json` lorsque le système de fichiers l’autorise ;
4. renvoie un lien WhatsApp prérempli au navigateur.

Copiez `.env.example` vers `.env.local` pour modifier le numéro WhatsApp :

```bash
cp .env.example .env.local
```

Pour un déploiement serverless à grande échelle, remplacez l’archivage JSON local par une base de données ou un CRM.
