// server/routes/users.js
const router = require("express").Router();
const User = require("../models/User");

// GET /api/users?currentUserId=...
router.get("/", async (req, res) => {
  try {
    const { currentUserId } = req.query;

    // current user ko list se hata do
    const query = currentUserId ? { _id: { $ne: currentUserId } } : {};

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error("Users fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// OPTIONAL: GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
