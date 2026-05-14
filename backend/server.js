require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Team Task Manager API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: "Unexpected server error", error: error.message });
});

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is required");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
