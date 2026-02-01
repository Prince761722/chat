// server/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");   // friends list
const userRoute = require("./routes/user");      // profile update
const messageRoutes = require("./routes/messages");
const User = require("./models/User");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// userId -> socketId
const onlineUsers = new Map();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

// static folder for uploaded images
app.use("/uploads", express.static("upload"));

// routes
app.get("/", (req, res) => {
  res.send("Realtime chat backend running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoutes);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Socket.io logic
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  // register userId to socket
  socket.on("register", async (userId) => {
    if (!userId) return;
    onlineUsers.set(userId, socket.id);
    console.log("User registered:", userId);

    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("user-online-status", { userId, isOnline: true });
    } catch (err) {
      console.error("Error updating user online:", err);
    }
  });

  // send-message event from client
  socket.on("send-message", async ({ from, to, text }) => {
    try {
      if (!from || !to || !text) return;

      const msg = await Message.create({ from, to, text });

      const payload = {
        _id: msg._id,
        text: msg.text,
        from,
        to,
        fromMe: false,
        createdAt: msg.createdAt
      };

      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", payload);
      }

      const senderSocketId = onlineUsers.get(from);
      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", {
          ...payload,
          fromMe: true
        });
      }
    } catch (err) {
      console.error("send-message error:", err);
    }
  });

  socket.on("disconnect", async () => {
    console.log("❌ Socket disconnected:", socket.id);

    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        try {
          await User.findByIdAndUpdate(userId, { isOnline: false });
          io.emit("user-online-status", { userId, isOnline: false });
        } catch (err) {
          console.error("Error updating user offline:", err);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
