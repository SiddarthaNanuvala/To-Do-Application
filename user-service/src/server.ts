import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import sequelize from "./database";
import authRoutes from "./routes/auth";
import healthRoutes from "./routes/health";
import { createDefaultUser } from "./models/User";

dotenv.config();

const app = express();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/auth", authRoutes);
app.use("/", healthRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection successful!");
    
    await sequelize.sync({ alter: true });
    console.log("Database synchronized successfully!");
    
    await createDefaultUser();

    const PORT = process.env.USER_SERVICE_PORT || 5000;
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.error("PostgreSQL connection or synchronization error:", error);
    process.exit(1);
  }
};

startServer();
