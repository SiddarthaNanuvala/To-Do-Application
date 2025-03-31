import { Pool, Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  host: process.env.TASK_DB_HOST,
  port: 5432,
  user: process.env.TASK_DB_USER,
  password: process.env.TASK_DB_PASSWORD,
  database: "postgres",
});

// Check and create database if it doesn't exist
const createDatabase = async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [process.env.TASK_DB_NAME]);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${process.env.TASK_DB_NAME}`);
      console.log(`Database '${process.env.TASK_DB_NAME}' created!`);
    } else {
      console.log(`Database '${process.env.TASK_DB_NAME}' already exists.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await client.end();
  }
};

(async () => {
  await createDatabase();
})();

const pool = new Pool({
  host: process.env.TASK_DB_HOST,
  port: 5432,
  user: process.env.TASK_DB_USER,
  password: process.env.TASK_DB_PASSWORD,
  database: process.env.TASK_DB_NAME,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait before timing out when connecting a new client
});

export default pool;