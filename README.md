# CAPACITY CONNECT

Digital Capacity Building and Learning Management Portal for Smart India Hackathon 2026, PS SIH26075 (IMD / MoES). This repository is a Phase 1 modular-monolith foundation: React communicates with a NestJS REST API, which owns business logic and persists to PostgreSQL through Prisma.

## Phase 1 capabilities

- JWT authentication, password hashing, role-aware navigation and API RBAC (`ADMIN`, `TRAINER`, `TRAINEE`)
- Profiles, course catalogue, trainer/admin course APIs, enrollment, modules and learning progress records
- Server-evaluated MCQ assessments; passing attempts complete enrollment and issue a verifiable certificate
- PostgreSQL notifications, audit-log and announcement-ready models; responsive scientific-government design system
- Demo seed: 1 admin, 5 trainers, 20 trainees, 10 courses, 30 modules, 50 assessments and 200 questions

## Structure

`frontend/` is Vite + React + TypeScript, using React Router, Axios and TanStack Query. `backend/` is a NestJS modular monolith organised by auth, users, courses, enrollments, assessments, certificates and notifications. Future competency and AI/RAG capabilities should be introduced as independent modules/services rather than coupled into these transactional modules.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`, and `frontend/.env.example` to `frontend/.env`.
2. Start PostgreSQL: `docker compose up -d`.
3. In `backend`: `npm install`, `npx prisma migrate dev --name init`, `npm run prisma:seed`, then `npm run start:dev`.
4. In `frontend`: `npm install`, then `npm run dev`.

Open `http://localhost:5173`.

## Demo credentials

All development-only accounts use `Demo@12345`.

| Role | Email |
| --- | --- |
| Admin | admin@capacityconnect.demo |
| Trainer | trainer@capacityconnect.demo |
| Trainee | trainee@capacityconnect.demo |

## API

All endpoints begin `/api/v1`. Auth uses `/auth/register`, `/auth/login`, `/auth/me`; courses include `/courses` and `/courses/:id/enroll`; user enrollment is `/users/me/enrollments`; assessments are submitted to `/assessments/:id/submit`; certificates expose `/certificates/:id/verify`.

## Roadmap

**Phase 1: implemented foundation.** Phase 2 will add competency, skill-gap and deterministic recommendations. Phase 3 will add separately deployed AI/RAG, semantic search and predictive services. No AI or vector workload is present in this foundation.
