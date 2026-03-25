# Bativio

La plateforme des artisans du batiment. Zero commission.

## Stack

| Couche | Technologie | Hebergement |
|--------|------------|-------------|
| Frontend | Next.js 16 (App Router) | Vercel |
| Backend | Spring Boot 3.4 (Java 21) | Railway |
| Base de donnees | PostgreSQL | Railway |
| Photos | Cloudinary | - |

## Lancer le projet

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Accessible sur http://localhost:3000

### Backend

```bash
cd backend
cp .env.example .env
./mvnw spring-boot:run
```

Accessible sur http://localhost:8080

## Structure

```
bativio/
  frontend/     # Next.js App Router + Tailwind v4
  backend/      # Spring Boot + JPA + PostgreSQL
```
