// server/routes/user.js
const router = require("express").Router();
const upload = require("../uploadConfig");
const User = require("../models/User");

// POST /api/user/update-avatar
router.post("/update-avatar", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      return res.status(400).json({ message: "User ID missing" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = "http://localhost:5000/uploads/" + req.file.filename;

    const updated = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    );

    const userObj = updated.toObject();
    delete userObj.passwordHash;

    res.json(userObj);
  } catch (err) {
    console.error("Avatar update error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;
