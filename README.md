# Task Manager - Containerized Application

## Project Overview

Task Manager is a modern, containerized web application for efficient task management. Built with a microservices architecture, it allows users to create, track, and manage tasks through a clean, minimalist interface.

## Technologies Used

### Frontend
- React with TypeScript
- Modern CSS design system
- Fetch API for data communication
- React Router for navigation

### Backend
- Node.js with Express
- Sequelize ORM
- JSON Web Tokens for authentication
- PostgreSQL databases

### Infrastructure
- Docker and Docker Compose for containerization
- Nginx as reverse proxy and load balancer
- Docker volumes for data persistence

## Architecture

The application follows a microservices architecture with the following components:

1. **Frontend Service**: React application serving the user interface
2. **Task Service**: Handles task creation, updates, and retrieval
3. **Database Service**: PostgreSQL instance for data storage
4. **Nginx**: Serves as an entry point, routing requests to appropriate services
┌─────────────┐      ┌─────────────┐
│    Client   │──────▶    Nginx    │
└─────────────┘      └──────┬──────┘
                            │
       ┌────────────────────┴─────────────────────┐
       │                                          │
┌──────▼─────┐                             ┌──────▼─────┐
│  Frontend  │                             │ Task Service│
└──────┬─────┘                             └──────┬─────┘
       │                                          │
       │                                   ┌──────▼─────┐
       └───────────────────────────────────▶ Task DB    │
                                           └────────────┘

                                           
                                           
## Features

- **Modern UI**: Clean, minimal design with responsive layout
- **Task Management**: Create, update, delete, and track tasks
- **Status Tracking**: Mark tasks as pending, in-progress, or completed
- **Containerized Deployment**: Easy deployment with Docker
- **Data Persistence**: All data persists across container restarts using Docker volumes

## Installation

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository

### Setup Instructions

1. Clone the repository:

git clone https://github.com/yourusername/task-manager.git

2. Create required directories:

mkdir -p nginx

3. Start the application:

docker-compose up -d


4. Access the application:
Open your browser and navigate to `http://localhost`

## Project Structure
task-manager/
├── docker-compose.yml     # Docker Compose configuration
├── frontend/              # React frontend application
│   ├── Dockerfile         # Frontend container configuration
│   ├── package.json       # Frontend dependencies
│   └── src/               # Frontend source code
│       ├── components/    # React components
│       └── styles/        # CSS styles
├── nginx/                 # Nginx configuration
│   └── nginx.conf         # Nginx proxy settings
└── task-service/          # Task management service
    ├── Dockerfile         # Task service container configuration
    ├── package.json       # Backend dependencies
    └── src/               # Backend source code
        ├── controllers/   # Request handlers
        ├── models/        # Data models
        └── routes/        # API routes

## Usage

### Login
- For demo purposes, use:
  - Email: `demo@example.com`
  - Password: `password`

### Task Management
1. After logging in, you'll be redirected to the task dashboard
2. Create tasks using the form at the top
3. View all tasks in the card layout below
4. Update task status or edit task details with the buttons on each card
5. Delete tasks you no longer need

## API Endpoints

### Task Service
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

## Development

### Running in Development Mode
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up


# Check volumes
docker volume ls

# Check logs
docker-compose -f docker-compose.dev.yml logs -f

    
# Check networks
docker network ls

# Check containers
docker ps


# Stop all services    
docker-compose -f docker-compose.dev.yml down


# Remove all containers, images, and volumes
docker-compose -f docker-compose.dev.yml down -v

# You can access the website at this address:
http://localhost:8080

