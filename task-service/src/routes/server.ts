import express from "express";
import { Request, Response } from "express";
import pool from "../config/db";
import cors from "cors";  // Import cors

const app = express();
const PORT = 3000;
const router = express.Router(); // Use express.Router() explicitly

app.use(cors()); 

app.use(express.json());

async function startServer() {
  try {
      await pool.query("SELECT 1"); // Simple connection check
      console.log("PostgreSQL connection successful!");
      
      // Create tasks table if it doesn't exist
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          user_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("'tasks' table ready!");

      // Use the router
      app.use(router);

      app.listen(PORT, () => {
          console.log(`Server started on http://localhost:${PORT}`);
      });

  } catch (error) {
      console.error("PostgreSQL connection error:", error);
      process.exit(1); // Exit process if database doesn't work
  }
}

// Root route
router.get("/", (req: Request, res: Response) => {
  res.send("Task Manager API - Use /tasks to manage your tasks");
});

// Get all tasks for a user
router.get("/tasks", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    const { rows } = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    
    res.json(rows);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific task
router.get("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    const { rows } = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ message: "Title and user ID required" });
    }
    
    const { rows } = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description || "", userId]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    // Check if task exists and belongs to the user
    const checkResult = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const { rows } = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, description, status, id, userId]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }
    
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    res.json({ message: "Task successfully deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

startServer();