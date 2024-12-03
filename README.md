# AI Chatbot

A full-stack AI chat application built with Next.js, Express, and PostgreSQL.

## Project Structure

```
├── client/         # Next.js frontend
├── server/         # Express backend
├── Dockerfile      # Docker configuration for PostgreSQL
└── README.md
```

## Prerequisites

- Git
- npm
- Node.js
- Docker
- PostgreSQL (Docker image)

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/tellib/ai-chatbot.git
cd ai-chatbot
```

### 2. Database Setup

```bash
docker-compose up --build
```

### 3. Server Setup

```bash
cd server
npm install
cp .env.sample .env    # Copy sample env file and modify as needed
npm run migrate        # Set up the database using prisma schema (PostgreSQL container must be running)
npm run dev            # Start the server (it might take a while to download the model the first time)
```

### 4. Client Setup

```bash
cd client
npm install --force     # Install dependencies (may need to use --force since NextJS 19 has some dependency issues because of React 19 RC)
cp .env.local.sample .env.local    # Copy sample env file and modify as needed
npm run dev                      # Start the client
```

### 5. Done

- Assuming you've followed the steps above and have not changed any of the default values of the environment variables, everything should be working.
- Open browser and navigate to http://localhost:3000 to see the chat interface. You will need to create an account to start chatting.
- To test if the server is working, navigate to http://localhost:4000/api/v1/
- To test if the database is working, use a database client like DataGrip to connect to the PostgreSQL database using the database URI in the .env file and check that there is a `users`, `chats`, and `messages` table.
