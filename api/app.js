import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";

import connectDB from "../config/connectDB.js";
import { errorHandler, notfound } from "../middleware/error.js";

import CustomerRoutes from "../routes/CustomerRoutes.js";
import DealRoutes from "../routes/DealRoutes.js";
import TaskRoutes from "../routes/TaskRoutes.js";
import RecordActivityRoutes from "../routes/RecordActivityRoutes.js";

dotenv.config({ path: "./config.env" });

const app = express();

// ❗ نضمن الاتصال يحصل مرة واحدة
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      next();
    } catch (error) {
      console.error("❌ DB connection error:", error);
      return res.status(500).json({ message: "Database connection failed" });
    }
  } else {
    next();
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🚀 CRM Dashboard API is running on Vercel!" });
});

app.use("/api/customer", CustomerRoutes);
app.use("/api/deal", DealRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/RecordActivity", RecordActivityRoutes);

app.use(notfound);
app.use(errorHandler);

export const handler = serverless(app);
