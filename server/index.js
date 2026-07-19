import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import languageVersions from "./languageVersion.js";

import authRouter from "./routes/authRoute.js";
import aiRouter from "./routes/aiRoute.js";
import codeRouter from "./routes/codeRoute.js";
import gymRouter from "./routes/gymRoutes.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/ai", aiRouter);
app.use("/api/auth", authRouter);
app.use("/api/code", codeRouter);
app.use("/api/gym", gymRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


