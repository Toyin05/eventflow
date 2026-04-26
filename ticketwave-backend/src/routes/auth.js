const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("=== REGISTER HIT ===");
  console.log("Body received:", req.body);

  const { fullName: name, email, password } = req.body;
  console.log("Extracted fields:", {
    name,
    email,
    password: password ? "[PROVIDED]" : "[MISSING]",
  });

  try {
    console.log("Checking for existing user with email:", email);
    const existing = await prisma.user.findUnique({ where: { email } });
    console.log("Existing user found:", existing ? "YES" : "NO");

    if (existing) {
      console.log("Rejecting - email already in use");
      return res.status(400).json({ error: "Email already in use" });
    }

    console.log("Hashing password...");
    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    console.log("Creating user in database...");
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });
    console.log("User created:", { id: user.id, name: user.name, email: user.email });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("JWT token generated successfully");

    res.json({
      token,
      user: { id: user.id, fullName: user.name, email: user.email, role: user.role },
    });
    console.log("=== REGISTER SUCCESS ===");
  } catch (err) {
    console.error("=== REGISTER ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  console.log("=== LOGIN HIT ===");
  console.log("Body received:", req.body);

  const { email, password } = req.body;
  console.log("Extracted fields:", { email, password: password ? "[PROVIDED]" : "[MISSING]" });

  try {
    console.log("Looking up user with email:", email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User found:", user ? "YES" : "NO");

    if (!user) {
      console.log("Rejecting - user not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    console.log("Comparing password...");
    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", valid);

    if (!valid) {
      console.log("Rejecting - wrong password");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("JWT token generated successfully");

    res.json({
      token,
      user: { id: user.id, fullName: user.name, email: user.email, role: user.role },
    });
    console.log("=== LOGIN SUCCESS ===");
  } catch (err) {
    console.error("=== LOGIN ERROR ===");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/register-admin', async (req, res) => {
  const { fullName: name, email, password, adminSecret } = req.body;
  if (adminSecret !== 'eventflow-admin-2026') {
    return res.status(403).json({ error: 'Invalid admin secret' });
  }
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: 'admin' }
    });

    res.json({ message: 'Admin account created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
