import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import { errorHandler, notfound } from "./middleware/error.js";

import CustomerRoutes from "./routes/CustomerRoutes.js";
import DealRoutes from "./routes/DealRoutes.js";
import TaskRoutes from "./routes/TaskRoutes.js";
import RecordActivityRoutes from "./routes/RecordActivityRoutes.js";

dotenv.config({ path: "./config.env" });

connectDB();

const app = express();
app.use(express.json());

app.use("/api/customer", CustomerRoutes);
app.use("/api/deal", DealRoutes);
app.use("/api/task", TaskRoutes);
app.use("/api/RecordActivity", RecordActivityRoutes);

app.use(notfound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
