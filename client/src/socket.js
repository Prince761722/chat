import { io } from "socket.io-client";

/**
 * Create socket instance
 * autoConnect: false → we control when it connects
 */
export const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
  autoConnect: false
});

/**
 * Connect socket and register user
 */
export const connectSocket = (userId) => {
  if (!userId) return;

  if (!socket.connected) {
    socket.connect();
    socket.emit("register", userId);
  }
};

/**
 * Optional: disconnect socket safely
 */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
