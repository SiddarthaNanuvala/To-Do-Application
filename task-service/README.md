# Task Service Documentation

## Project Overview
The Task Service is a RESTful microservice built with Node.js/TypeScript that manages tasks in the task management system.

## Project Structure
```
task-service/
├── src/
│   ├── config/
│   │   └── db.ts         # Database configuration
│   └── routes/
│       └── server.ts     # Express server & API routes
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Technical Stack
- Node.js 16 (Alpine)
- TypeScript
- Express.js
- PostgreSQL
- Docker

## Database Configuration (db.ts)
```typescript
// Database connection setup
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "taskdb"
});
```

## Database Schema
```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Get All Tasks
```typescript
GET /tasks?userId={userId}
Response: Task[]
```

### 2. Get Single Task
```typescript
GET /tasks/:id?userId={userId}
Response: Task
```

### 3. Create Task
```typescript
POST /tasks
Body: {
  title: string,
  description: string,
  userId: number
}
```

### 4. Update Task
```typescript
PUT /tasks/:id
Body: {
  title: string,
  description: string,
  status: string,
  userId: number
}
```

### 5. Delete Task
```typescript
DELETE /tasks/:id?userId={userId}
```

## Error Handling
```typescript
try {
  // Operation logic
} catch (error) {
  console.error("Error message:", error);
  res.status(500).json({ message: "Server error" });
}
```

## Security Features
1. User ID validation on all routes
2. Task ownership verification
3. Input validation
4. CORS enabled

## Docker Configuration
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/routes/server.js"]
```

## Dependencies
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "pg": "^8.14.0",
    "dotenv": "^16.4.7"
  }
}
```

## TypeScript Configuration
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ES2022",
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## Response Examples

### Success Response
```json
{
  "id": 1,
  "title": "Task Title",
  "description": "Description",
  "status": "pending",
  "user_id": 123,
  "created_at": "2024-03-14T10:00:00Z"
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

## Key Features
1. **Database Auto-initialization**
   - Automatic database creation
   - Table creation if not exists
   - Connection pool management

2. **Task Management**
   - CRUD operations
   - Status tracking
   - User-specific tasks
   - Timestamp tracking

3. **Error Handling**
   - Detailed error logging
   - User-friendly error messages
   - HTTP status codes

4. **Security**
   - User verification
   - Task ownership validation
   - Input sanitization

This service is designed to be:
- Scalable
- Maintainable
- Secure
- Docker-ready
- Easy to integrate

The service follows RESTful principles and provides a robust API for task management while ensuring data integrity and security.
