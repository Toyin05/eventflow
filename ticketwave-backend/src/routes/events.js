const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: "asc" } });
    res.json(events);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/register", authMiddleware, async (req, res) => {
  try {
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const existingTicket = await prisma.ticket.findFirst({
      where: { userId: req.user.id, eventId: req.params.id },
    });
    if (existingTicket) return res.status(400).json({ error: "Already registered for this event" });

    const ticketCount = await prisma.ticket.count({ where: { eventId: req.params.id } });
    if (ticketCount >= event.capacity)
      return res.status(400).json({ error: "Event is fully booked" });

    const ticket = await prisma.ticket.create({
      data: { userId: req.user.id, eventId: req.params.id },
      include: { event: true, user: true },
    });

    res.json(ticket);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
