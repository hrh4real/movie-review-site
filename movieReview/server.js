import express from "express";
import cors from "cors";
import reviews from "./api/reviews.route.js";

const app = express();

// Enable CORS for all requests
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// API routes
app.use("/api/v1/reviews", reviews);

// Catch-all route for undefined endpoints
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;