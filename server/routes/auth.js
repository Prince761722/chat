const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({
      username: username.trim().toLowerCase()
    });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      username: username.trim().toLowerCase(),
      passwordHash
    });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(201).json(userObj);
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const user = await User.findOne({
      username: username.trim().toLowerCase()
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.json(userObj);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
