QuizMaster

A minimal, full-stack Quiz Management System.

Public: browse & take quizzes

Admin: static login → create, list, edit, delete quizzes

Stack: React (Vite) · Node/Express · Prisma · PostgreSQL

Architecture: Component-based frontend, modular backend (routes/middlewares/services)

Features

Landing on Available Quizzes (public)

Admin login (static cred: admin / admin123)

Create quizzes with:

MCQ (single correct)

True/False

Short Text (optional answer key for auto-scoring)

Take quiz & score (no answers leaked on public endpoints)

Admin Manage Quizzes: list by ID, Edit and Delete

Protected routes (frontend) for admin pages

Seed script with a demo quiz

Tech
Layer	Tools
Frontend	React 18, Vite, React Router
Backend	Node.js, Express, CORS, JSON Web Tokens
DB / ORM	PostgreSQL, Prisma ORM
Project Structure
quizmaster/
├─ client/                       # React app (Vite)
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  ├─ index.css
│  │  ├─ hooks/
│  │  │  └─ useAuth.js
│  │  ├─ lib/
│  │  │  └─ api.js
│  │  ├─ components/
│  │  │  ├─ Header.jsx
│  │  │  ├─ Footer.jsx
│  │  │  ├─ QuizCard.jsx
│  │  │  ├─ QuestionEditor.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  └─ pages/
│  │     ├─ PublicList.jsx
│  │     ├─ TakeQuiz.jsx
│  │     ├─ AdminLogin.jsx
│  │     ├─ AdminPanel.jsx         # Create new quiz
│  │     ├─ AdminQuizzes.jsx       # List + Delete + Edit links
│  │     └─ AdminEditQuiz.jsx      # Update quiz
│  └─ .env                         # VITE_API=http://localhost:4000
│
├─ server/                       # API + Prisma
│  ├─ src/
│  │  ├─ app.js                  # Express app (mounts routers)
│  │  ├─ server.js               # Entry (starts server)
│  │  ├─ prisma.js               # Prisma client singleton
│  │  ├─ config/
│  │  │  └─ env.js               # loads .env and exports vars
│  │  ├─ middlewares/
│  │  │  └─ authMiddleware.js
│  │  ├─ routes/
│  │  │  ├─ auth.routes.js
│  │  │  ├─ quiz.routes.js       # public routes
│  │  │  └─ admin.routes.js      # protected routes
│  │  └─ services/
│  │     ├─ authService.js
│  │     └─ quizService.js
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ seed.js
│  └─ .env                        # DB URL, admin creds, PORT, JWT
│
└─ README.md

Prerequisites

Node.js 18+

PostgreSQL (local install or Docker or managed DB like Supabase/Neon)

Option A — Docker (fastest local setup)
docker volume create pgdata
docker run -d --name quizdb -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=quizmaster \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16

Option B — Local Postgres (Installer)

Install PostgreSQL

Create database quizmaster

Default credentials in this README assume:

user: postgres

password: postgres

port: 5432

Option C — Cloud Postgres (Supabase/Neon/RDS)

Create project, copy connection URI

Put it in server/.env as DATABASE_URL="postgresql://..."
If needed: append ?sslmode=require

Environment Variables
server/.env (example)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quizmaster?schema=public"
PORT=4000
JWT_SECRET="supersecretkey"
ADMIN_USER="admin"
# password = admin123
ADMIN_PASS_HASH="$2a$10$Ho0HkK8V7c5U7rA1bnpQ4u1sQyQpSxJj9r9n6WmV4wT2k4bPzqBFe"


Generate a new bcrypt hash (if you want a different password):

node -e 'console.log(require("bcryptjs").hashSync("admin123",10))'

client/.env
VITE_API=http://localhost:4000


After changing any .env, restart the corresponding dev server.

Install & Run
1) Backend (API)
cd server
npm install

# Create tables from Prisma schema
npx prisma migrate dev --name init

# (optional) Seed demo quiz
node prisma/seed.js

# Start API
npm run dev
# -> ✅ API running on http://localhost:4000

2) Frontend (React)
cd ../client
npm install
npm run dev
# -> open the printed URL (usually http://localhost:5173)

Usage

Open the app → Available Quizzes (public)

Go to Admin Panel → login

Username: admin

Password: admin123

Create a new quiz → Save → appears on public page

Manage Quizzes (inside Admin Panel): list all quizzes by ID, Edit, Delete

Public users can take quizzes and see their score

Frontend Notes

Component-based architecture: shared components in src/components, hooks in src/hooks, pages in src/pages.

Protected routes:

/admin/panel, /admin/quizzes, /admin/quizzes/:id/edit are wrapped with ProtectedRoute.

If not logged in → redirect to /admin.

Start button bottom-right in cards: implemented via CSS (flex/absolute) in QuizCard.

Backend Notes

Modular, production-style structure: routes → services → prisma

Public routes (/api/quizzes):

GET /api/quizzes → list (no answers)

GET /api/quizzes/:id → quiz detail (no answers)

POST /api/quizzes/:id/submit → grade submission

Auth route:

POST /api/auth/login → returns JWT (static admin credentials from .env)

Admin routes (/api/admin, all require Authorization: Bearer <token>):

POST /api/admin/quizzes → create quiz

GET /api/admin/quizzes → list quizzes for admin (with counts)

GET /api/admin/quizzes/:id → full quiz (includes options/correct answers)

PUT /api/admin/quizzes/:id → update quiz (replace questions/options)

DELETE /api/admin/quizzes/:id → delete quiz

Prisma Schema (summary)
model Quiz {
  id        Int        @id @default(autoincrement())
  title     String
  createdAt DateTime   @default(now())
  questions Question[]
}

enum QuestionType { MCQ TRUE_FALSE SHORT_TEXT }

model Question {
  id        Int           @id @default(autoincrement())
  text      String
  type      QuestionType
  quizId    Int
  quiz      Quiz          @relation(fields: [quizId], references: [id], onDelete: Cascade)
  options   Option[]
  answerKey String?
  correct   Boolean?
  order     Int           @default(0)
}

model Option {
  id         Int      @id @default(autoincrement())
  text       String
  isCorrect  Boolean  @default(false)
  questionId Int
  question   Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

API Examples
Login
POST /api/auth/login
Content-Type: application/json

{ "username": "admin", "password": "admin123" }


Response:

{ "token": "JWT...", "user": { "username": "admin" } }

Public
GET  /api/quizzes
GET  /api/quizzes/:id
POST /api/quizzes/:id/submit
# body: { "answers": { [questionId]: optionId | true|false | "text" } }

Admin (with Bearer token)
GET    /api/admin/quizzes
GET    /api/admin/quizzes/:id
POST   /api/admin/quizzes
PUT    /api/admin/quizzes/:id
DELETE /api/admin/quizzes/:id

Seeding
cd server
node prisma/seed.js


Seeds General Knowledge 101:

MCQ: Red Planet → Mars

True/False: “Sun rises in the West” → False

Short Text: “Chemical symbol for water?” → H2O

Troubleshooting

Frontend shows ERR_CONNECTION_REFUSED
→ API not running or wrong port. Start API and ensure client/.env → VITE_API matches.

Login shows “Invalid credentials”
→ .env mismatch or bad hash.
Regenerate:
node -e 'console.log(require("bcryptjs").hashSync("admin123",10))'
Update ADMIN_PASS_HASH, restart API.

Prisma P1001 (can’t reach DB)
→ Check DATABASE_URL host/port/password.
If Docker runs on 5433:
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/quizmaster?schema=public"

Port already in use
→ Change PORT in server/.env and VITE_API in client/.env. Restart both.

pgAdmin can’t connect
→ Ensure Postgres service/container is running and listening (5432 or your chosen port).

Production / Deployment Notes

Use a managed Postgres (Supabase/Neon/RDS).

Set DATABASE_URL (add sslmode=require if needed).

Run migrations on deploy: prisma migrate deploy.

Host API on Render/Fly/EC2; host frontend on Vercel/Netlify.
Set client VITE_API to your public API URL and rebuild.