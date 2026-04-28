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
  console.log("Register Request Received. Body:", req.body);
  console.log("User ID from Token:", req.user?.id);
  console.log("Event ID from Params:", req.params.id);
  try {
    console.log("Looking up event...");
    const event = await prisma.event.findUnique({ where: { id: req.params.id } });
    console.log("Event found:", event ? "yes" : "no");
    if (!event) return res.status(404).json({ error: "Event not found" });

    console.log("Checking for existing ticket...");
    const existingTicket = await prisma.ticket.findFirst({
      where: { userId: req.user.id, eventId: req.params.id },
    });
    console.log("Existing ticket:", existingTicket ? "yes" : "no");
    if (existingTicket) return res.status(400).json({ error: "Already registered for this event" });

    console.log("Counting tickets for event...");
    const ticketCount = await prisma.ticket.count({ where: { eventId: req.params.id } });
    console.log("Ticket count:", ticketCount, "capacity:", event.capacity);
    if (ticketCount >= event.capacity)
      return res.status(400).json({ error: "Event is fully booked" });

    console.log("Creating ticket...");
    const ticket = await prisma.ticket.create({
      data: { userId: req.user.id, eventId: req.params.id },
      include: { event: true, user: true },
    });
    console.log("Ticket created successfully");

    res.json(ticket);
  } catch (error) {
    console.error("ERROR_NAME:", error.name);
    console.error("ERROR_MESSAGE:", error.message);
    console.error("ERROR_CODE:", error.code);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
