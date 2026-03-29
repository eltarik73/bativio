# Bativio

La plateforme des artisans du bâtiment en Rhône-Alpes. Zéro commission.

## Stack

| Couche | Technologie | Hébergement |
|--------|------------|-------------|
| App | Next.js 16 (App Router, API Routes) | Vercel |
| ORM | Prisma 6 | - |
| Base de données | PostgreSQL | Railway |
| Auth | JWT cookie HttpOnly (jose + bcryptjs) | - |
| Photos | Cloudinary | - |
| Emails | Resend | - |
| Paiements | Stripe | - |

## Lancer le projet

```bash
cd frontend
cp .env.local.example .env.local
# Remplir DATABASE_URL, JWT_SECRET, etc.
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Accessible sur http://localhost:3000

## Structure

```
bativio/
  frontend/
    src/
      app/
        api/v1/        # API Routes (auth, public, artisans, admin)
        admin/          # Pages admin
        dashboard/      # Espace artisan
        [ville]/        # Pages villes + vitrines artisan
      components/       # Composants React
      lib/              # Prisma, auth, email, helpers
    prisma/
      schema.prisma     # Schéma base de données
      seed.ts           # Données initiales
```

## Admin

Login : `admin@bativio.fr` / `Bativio2026!`
