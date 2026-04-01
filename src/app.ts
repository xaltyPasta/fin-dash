import express from "express";
import cors from "cors";
import { config } from "./config";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route (important for deployment)
app.get(["/","/health"], (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

export default app;
