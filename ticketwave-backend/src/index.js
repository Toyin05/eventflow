const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/tickets", ticketRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.json({ message: "EventFlow API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
