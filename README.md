Backend Setup

Move into backend:

cd backend

Install dependencies:

npm install

Create environment file:

copy .env.example .env

Open .env

Current temporary DB:

DATABASE_URL=YOUR_NEON_DATABASE_URL

Later switch to local PostgreSQL:

DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/foodieland

Generate Prisma client:

npx prisma generate

Apply migrations:

npx prisma migrate dev

Verify database:

npx prisma studio

Start backend:

npm run dev

Backend runs on:

http://localhost:3000
Frontend Setup

Move into frontend:

cd frontend

Install dependencies:

npm install

Start:

npm run dev

Frontend runs on:

http://localhost:5173
Database Workflow

Do NOT modify tables manually.

Schema changes flow:

Update schema.prisma
      ↓
Run migration
      ↓
Generate Prisma client
      ↓
Push code

Commands:

npx prisma migrate dev --name migration_name
npx prisma generate
Git Workflow

Create branch:

git checkout -b feature/module-name

Examples:

feature/auth
feature/restaurants
feature/orders
feature/frontend-cart

Push:

git add .
git commit -m "feat(module): description"
git push