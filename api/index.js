import express from "express";
import dotenv from "dotenv";
import serverless from "serverless-http";

import connectDB from "../config/connectDB.js";
import { errorHandler, notfound } from "../middleware/error.js";

import CustomerRoutes from "../routes/CustomerRoutes.js";
import DealRoutes from "../routes/DealRoutes.js";
import TaskRoutes from "../routes/TaskRoutes.js";
import RecordActivityRoutes from "../routes/RecordActivityRoutes.js";

// تحميل المتغيرات البيئية
dotenv.config({ path: "./config.env" });

// الاتصال بقاعدة البيانات
await connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "🚀 CRM Dashboard API is running on Vercel!" });
});

app.use("/api/customer", CustomerRoutes);
app.use("/api/deal", DealRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/RecordActivity", RecordActivityRoutes);

// ميدل وير الأخطاء
app.use(notfound);
app.use(errorHandler);

// هنا التعديل المهم
export const handler = serverless(app);
