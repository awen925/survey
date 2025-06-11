# Waterlily Survey Application

A full-stack survey application built with React, TypeScript, Node.js, and PostgreSQL using Prisma ORM.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Project Structure

```
.
├── backend/           # Node.js backend
│   ├── prisma/       # Prisma schema and migrations
│   ├── src/          # Source code
│   ├── tests/        # Test files
│   └── package.json  # Backend dependencies
└── survey-app/       # React frontend
    ├── src/          # Source code
    └── package.json  # Frontend dependencies
```

## Setup Instructions

### Database Setup

1. Create a PostgreSQL database named `survey_db`
2. Copy `.env.example` to `.env` in the backend directory and update the DATABASE_URL if needed

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

4. Run database migrations:
   ```bash
   npm run prisma:migrate
   ```

5. Seed the database with initial data:
   ```bash
   npm run prisma:seed
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the survey-app directory:
   ```bash
   cd survey-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Features

- Survey form with various question types (text, number, select, radio, checkbox)
- Form validation
- Post-submission review
- Responsive design
- Modern UI with Tailwind CSS
- Database management with Prisma ORM
- Database migrations and seeding

## API Endpoints

- GET /api/survey/questions - Get all survey questions
- POST /api/survey/submit - Submit survey responses
- GET /api/survey/submissions/:id - Get submission details

## Technologies Used

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Axios

- Backend:
  - Node.js
  - Express
  - Prisma ORM
  - PostgreSQL
  - TypeScript
  - Zod (for validation)

## Database Management

The application uses Prisma ORM for database management. Key commands:

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio for database management
- `npm run prisma:seed` - Seed the database with initial data
