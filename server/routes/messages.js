const router = require("express").Router();
const Message = require("../models/Message");

// GET /api/messages/:friendId
// requires header: x-user-id
router.get("/:friendId", async (req, res) => {
  try {
    const currentUserId = req.header("x-user-id");
    const { friendId } = req.params;

    if (!currentUserId) {
      return res.status(400).json({ message: "x-user-id header is required" });
    }

    const messages = await Message.find({
      $or: [
        { from: currentUserId, to: friendId },
        { from: friendId, to: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    const formatted = messages.map((m) => ({
      _id: m._id,
      text: m.text,
      fromMe: m.from.toString() === currentUserId,
      from: m.from,
      to: m.to,
      createdAt: m.createdAt
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Messages fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/messages
router.post("/", async (req, res) => {
  try {
    const currentUserId = req.header("x-user-id");
    const { to, text } = req.body;

    if (!currentUserId || !to || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const msg = await Message.create({
      from: currentUserId,
      to,
      text
    });

    res.status(201).json(msg);
  } catch (err) {
    console.error("Message create error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
