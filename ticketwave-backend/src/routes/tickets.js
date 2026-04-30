const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: { event: true },
    });
    res.json(tickets);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:ticketCode", async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketCode: req.params.ticketCode },
      include: {
        event: true,
        user: { select: { name: true } }
      },
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { event: true, user: true }
    });
    const formatted = tickets.map(t => ({
      id: t.id,
      ticketCode: t.ticketCode,
      status: t.status,
      createdAt: t.createdAt,
      user: { fullName: t.user.name },
      event: { title: t.event.title }
    }));
    res.json(formatted);
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:ticketCode', authMiddleware, async (req, res) => {
  const { ticketCode } = req.params;
  const userId = req.user.id;

  try {
    const ticket = await prisma.ticket.findFirst({
      where: { ticketCode, userId }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found or unauthorized" });
    }

    await prisma.ticket.delete({
      where: { id: ticket.id }
    });

    res.json({ message: "Unregistered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to unregister" });
  }
});

module.exports = router;
