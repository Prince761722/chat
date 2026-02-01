import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true
});

export const connectSocket = (userId) => {
  if (!userId) return;
  if (!socket.connected) {
    socket.connect();
    socket.emit("register", userId);
  }
};
