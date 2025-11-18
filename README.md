# Repository layout

Assuming two folders at the repository root:

# /backend    # NestJS backend 
# /frontend   # Next.js frontend 


# Backend (NestJS) — Quick start

Path: ./backend
Environment variables
Create a file .env in the backend root (rename from .env.example if you have it). Example:

# .env
#Postgres

DB_HOST=127.0.0.1

DB_PORT=5455

DB_USERNAME=postgres

DB_PASSWORD=postgres

DB_DATABASE=todoDB


#MongoDB

MONGO_URI=mongodb://localhost:27017/tasklogs


#JWT

JWT_SECRET=supersecretkey

JWT_EXPIRES_IN=3d


#App

PORT=3001

# Install & run (development)
1. Install dependencies:   
cd backend
npm install
2. Start PostgreSQL and MongoDB
3. Start the app (development):
   npm run start:dev

# Frontend (Next.js) — Quick start

Path: ./frontend 
# Environment variables
Create .env.local at frontend root with API base URL:

NEXT_PUBLIC_API_BASE=http://localhost:3001

# Install & run

cd frontend

npm install

npm run dev
