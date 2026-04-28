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

router.get("/recent", async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { event: true, user: true }
    });
  const formatted = await Promise.all(tickets.map(async (t) => {
    const registered = await prisma.ticket.count({ where: { eventId: t.eventId } });
    return {
      ticketCode: t.ticketCode,
      status: t.status,
      createdAt: t.createdAt,
      user: { fullName: t.user?.name || 'Unknown', email: t.user?.email || 'N/A' }
    };
  }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.use(authMiddleware, adminMiddleware);

router.get("/events/:id/tickets", async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { eventId: req.params.id },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    const formatted = tickets.map(t => ({
      ticketCode: t.ticketCode,
      status: t.status,
      createdAt: t.createdAt,
      user: { fullName: t.user.name, email: t.user.email }
    }));
    res.json(formatted);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

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
    await prisma.$transaction(async (prisma) => {
      // First, delete all tickets associated with the event
      await prisma.ticket.deleteMany({ where: { eventId: req.params.id } });
      // Then, delete the event
      await prisma.event.delete({ where: { id: req.params.id } });
    });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete event" });
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

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const adminId = req.user.id;

  if (userId === adminId) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      await prisma.ticket.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
