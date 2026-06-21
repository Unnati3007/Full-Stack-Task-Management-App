# Task Manager — Full-Stack Web Application

A task management app built with **React (Vite)**, **Node.js/Express**, and **PostgreSQL**, with JWT authentication and real-time updates over WebSockets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Real-time | WebSockets (ws) |
| Testing | Jest, Supertest |
| Docs | Swagger / OpenAPI (`/api-docs`) |

## Project Structure

```
task-manager/
├── client/          # React (Vite) frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── context/
├── server/          # Express backend
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── migrations/
├── docker-compose.yml   # local db + server
└── README.md
```

## Run locally

### 1. Database + backend (Docker)
```bash
cp server/.env.example server/.env   # fill in JWT secrets
docker-compose up --build
```
This starts Postgres on `5432` and the API on `http://localhost:5000`.

Then run migrations once, from your host machine:
```bash
cd server
DATABASE_URL=postgresql://taskuser:taskpass@localhost:5432/taskdb npm run migrate
```

### 2. Frontend
```bash
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm install
npm run dev
```
Open `http://localhost:5173`.

### Run tests
```bash
cd server && npm test -- --coverage
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/tasks` | Get all tasks (auth required) |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/users/me` | Get current user profile |

Full interactive docs at `/api-docs` once the server is running.

## Deploying for free (Neon + Render + Vercel)

- **Neon** — free, permanent Postgres database
- **Render** — free Node.js hosting for the backend
- **Vercel** — free static hosting for the React frontend

Environment variables needed in each:

**Render (backend):**
```
DATABASE_URL=<your Neon connection string>
JWT_SECRET=<random string>
JWT_REFRESH_SECRET=<different random string>
CLIENT_URL=<your Vercel URL>
```

**Vercel (frontend):**
```
VITE_API_URL=<your Render backend URL>
```
