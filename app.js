const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");

dotenv.config({ path: "./config.env" });

connectDB();

const app = express();

app.use(express.json());

app.use("/api/customer", require("./routes/CustomerRoutes"));
app.use("/api/deal", require("./routes/DealRoutes"));
app.use("/api/task", require("./routes/TaskRoutes"));
app.use("/api/RecordActivity", require("./routes/RecordActivityRoutes"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
