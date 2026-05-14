const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/User");

const normalizeRole = (role) => String(role || "").toLowerCase();

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = normalizeRole(req.body.role);

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    if (!["admin", "member"].includes(role)) {
      return res.status(400).json({ message: "Role must be Admin or Member" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    const user = await User.create({ name, email, password, role });
    const token = createToken(user);

    return res.status(201).json({ token, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken(user);
    return res.status(200).json({ token, user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { register, login };
