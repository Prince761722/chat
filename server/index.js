// server/index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const userRoute = require("./routes/user");
const messageRoutes = require("./routes/messages");
const User = require("./models/User");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

/* =========================
   TEMP CORS (BACKEND FIRST)
   allow all origins for now
========================= */
const corsOptions = {
  origin: true,            // TEMP (change later)
  credentials: true
};

/* =========================
   EXPRESS MIDDLEWARES
========================= */
app.use(express.json());
app.use(cors(corsOptions));

/* =========================
   SOCKET.IO SETUP
========================= */
const io = new Server(server, {
  cors: corsOptions
});

// userId -> socketId
const onlineUsers = new Map();

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static("upload"));

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.send("Realtime chat backend running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoute);
app.use("/api/messages", messageRoutes);

/* =========================
   DATABASE
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

/* =========================
   SOCKET LOGIC
========================= */
io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("register", async (userId) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);

    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("user-online-status", { userId, isOnline: true });
    } catch (err) {
      console.error("Online update error:", err);
    }
  });

  socket.on("send-message", async ({ from, to, text }) => {
    try {
      if (!from || !to || !text) return;

      const msg = await Message.create({ from, to, text });

      const basePayload = {
        _id: msg._id,
        text: msg.text,
        from,
        to,
        createdAt: msg.createdAt
      };

      const receiverSocketId = onlineUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", {
          ...basePayload,
          fromMe: false
        });
      }

      const senderSocketId = onlineUsers.get(from);
      if (senderSocketId) {
        io.to(senderSocketId).emit("receive-message", {
          ...basePayload,
          fromMe: true
        });
      }
    } catch (err) {
      console.error("send-message error:", err);
    }
  });

  socket.on("disconnect", async () => {
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        try {
          await User.findByIdAndUpdate(userId, { isOnline: false });
          io.emit("user-online-status", { userId, isOnline: false });
        } catch (err) {
          console.error("Offline update error:", err);
        }
        break;
      }
    }
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
