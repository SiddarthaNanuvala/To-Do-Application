import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router: Router = Router();

// Middleware to authenticate token
const authenticate = async (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

// Register a new user
router.post("/register", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "This email is already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });

        return res.status(201).json({ message: "User created!" });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ 
            where: { email },
            attributes: ["id", "email", "password"] 
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        return res.json({ token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

// Get current user
router.get("/me", authenticate, async (req: Request, res: Response) => {
    try {
        const user = await User.findByPk((req as any).user.id, { attributes: ["id", "email"] });

        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
    } catch (error) {
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
