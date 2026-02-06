import { useEffect, useState } from "react";
import { socket, connectSocket } from "../socket";
import EmojiPicker from "emoji-picker-react";

const ChatContainer = ({ currentUserId, friend }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  /* =========================
     CONNECT SOCKET
  ========================= */
  useEffect(() => {
    if (!currentUserId) return;
    connectSocket(currentUserId);
  }, [currentUserId]);

  /* =========================
     LOAD PREVIOUS MESSAGES
  ========================= */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!friend?._id || !currentUserId) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/messages/${friend._id}`,
          {
            headers: { "x-user-id": currentUserId },
            credentials: "include"
          }
        );

        const data = await res.json();
        setMessages(
          data.map((msg) => ({
            ...msg,
            fromMe: msg.from === currentUserId
          }))
        );
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [friend?._id, currentUserId]);

  /* =========================
     SOCKET LISTENER (RECEIVE)
  ========================= */
  useEffect(() => {
    if (!currentUserId || !friend?._id) return;

    const handleReceive = (msg) => {
      if (
        (msg.from === friend._id && msg.to === currentUserId) ||
        (msg.from === currentUserId && msg.to === friend._id)
      ) {
        setMessages((prev) => [
          ...prev,
          { ...msg, fromMe: msg.from === currentUserId }
        ]);
      }
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [friend?._id, currentUserId]);

  /* =========================
     SEND MESSAGE
  ========================= */
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !friend?._id || !currentUserId) return;

    const messageText = text.trim();
    setText("");
    setShowEmoji(false);

    // Optimistic UI update
    const tempMessage = {
      _id: Date.now().toString(),
      text: messageText,
      from: currentUserId,
      to: friend._id,
      fromMe: true
    };

    setMessages((prev) => [...prev, tempMessage]);

    socket.emit("send-message", {
      from: currentUserId,
      to: friend._id,
      text: messageText
    });
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (!friend) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-400">
        Select a user on the left to start chatting.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Top bar */}
      <div className="h-14 border-b border-white/10 px-4 flex items-center justify-between bg-slate-950/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-400 to-sky-500 flex items-center justify-center text-xs font-semibold">
            {friend.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium leading-none">{friend.name}</p>
            <p className="text-[11px] text-emerald-400">
              {friend.isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {loading && (
          <p className="text-[11px] text-slate-400">Loading messages…</p>
        )}

        {!loading && messages.length === 0 && (
          <p className="text-[11px] text-center text-slate-500">
            No messages yet. Say hi 👋
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                msg.fromMe
                  ? "rounded-tr-sm bg-indigo-500/90 text-white shadow-md shadow-indigo-500/40"
                  : "rounded-tl-sm bg-white/10 text-slate-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-16 left-4 z-50">
          <EmojiPicker
            onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
            theme="dark"
            height={320}
            width={260}
          />
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="border-t border-white/10 px-4 py-3 bg-slate-950/70"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmoji((prev) => !prev)}
            className="h-8 w-8 rounded-2xl bg-white/5 flex items-center justify-center text-sm text-slate-300 hover:bg-white/10 transition"
          >
            😊
          </button>

          <div className="flex-1 rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs flex items-center">
            <input
              type="text"
              placeholder={`Message ${friend.name.split(" ")[0]}…`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-transparent outline-none flex-1 text-xs text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <button
            type="submit"
            className="h-9 px-4 rounded-2xl bg-indigo-500 text-[11px] font-semibold shadow-md shadow-indigo-500/40 hover:bg-indigo-400 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContainer;
