## Getting Started

### 1. Backend Setup
- Navigate to the backend directory: `cd backend`
- Install dependencies: `npm install`
- Create a `.env` file based on `.env.example` and add your `OPENAI_API_KEY`.
- Run database migrations: `npx prisma migrate dev --name init`
- Start the server: `node src/clams/index.js`

### 2. Frontend Setup
- Navigate to the frontend directory: `cd frontend`
- Install dependencies: `npm install`
- Start the React app: `npm run dev`