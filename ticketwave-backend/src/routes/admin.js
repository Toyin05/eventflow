const express = require("express");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const prisma = require("../lib/prisma");

const router = express.Router();

router.post('/make-first-admin', async (req, res) => {
  const { email, secret } = req.body;
  if (secret !== 'eventflow2026') {
    return res.status(403).json({ error: 'Invalid secret' });
  }
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'admin' }
    });
    res.json({ message: 'User promoted to admin', email: user.email, role: user.role });
  } catch {
    res.status(500).json({ error: 'User not found or server error' });
  }
});

router.use(authMiddleware, adminMiddleware);

router.get("/stats", async (req, res) => {
  try {
    const [totalEvents, totalTickets, totalUsers] = await Promise.all([
      prisma.event.count(),
      prisma.ticket.count(),
      prisma.user.count(),
    ]);
    res.json({ totalEvents, totalTickets, totalUsers });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/events", async (req, res) => {
  const { title, description, date, location, capacity } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: parseInt(capacity),
      },
    });
    res.json(event);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/events/:id", async (req, res) => {
  const { title, description, date, location, capacity } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        title,
        description,
        date: new Date(date),
        location,
        capacity: parseInt(capacity),
      },
    });
    res.json(event);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/events/:id", async (req, res) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: "Event deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { _count: { select: { tickets: true } } },
      orderBy: { createdAt: "desc" },
    });
    const formatted = users.map((u) => ({
      id: u.id,
      fullName: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      ticketCount: u._count.tickets,
    }));
    res.json(formatted);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json({
      id: user.id,
      fullName: user.name,
      email: user.email,
      role: user.role,
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
