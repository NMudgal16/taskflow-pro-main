require("dotenv").config({ path: require("path").join(__dirname, ".env") });

const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminRoutes = require("./routes/adminRoutes");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
  credentials: true
}));
app.use(express.json({ limit: "1mb" }));
const isProduction = process.env.NODE_ENV === "production";

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 500 : 5000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
  skip: () => !isProduction,
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Team Task Manager API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  res.status(500).json({ message: "Unexpected server error", error: error.message });
});

const getMongoUri = () => {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = uri && (uri.includes("<password>") || uri.includes("<REPLACE_WITH_PASSWORD>") || uri.includes("<db_password>") || uri.includes("<"));

  if (isPlaceholder) {
    console.warn("Warning: backend/.env contains a placeholder MongoDB URI. Falling back to local MongoDB URI.");
    return "mongodb://127.0.0.1:27017/taskflow";
  }

  return uri;
};

const isPlaceholderValue = (value) => {
  return !value || value.includes("<") || value.includes("REPLACE_WITH") || value.includes("db_password");
};

const ensureAdminUser = async () => {
  const adminName = process.env.ADMIN_NAME || "Administrator";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (isPlaceholderValue(adminEmail) || isPlaceholderValue(adminPassword)) {
    return;
  }

  const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!existingUser) {
    await User.create({ name: adminName, email: adminEmail, password: adminPassword, role: "admin" });
    console.log(`Admin user created: ${adminEmail}`);
  } else if (existingUser.role !== "admin") {
    existingUser.role = "admin";
    await existingUser.save();
    console.log(`Existing user promoted to admin: ${adminEmail}`);
  }
};

const startServer = async () => {
  try {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
      throw new Error("MONGODB_URI is required");
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is required");
    }

    await mongoose.connect(mongoUri);
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
