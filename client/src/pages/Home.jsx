import { useEffect, useState } from "react";
import FriendsSidebar from "../components/FriendsSidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import UserProfilePanel from "../components/UserProfilePanel.jsx";
import { connectSocket } from "../socket";

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(true);

  /* =========================
     LOAD LOGGED-IN USER
  ========================= */
  useEffect(() => {
    const stored = localStorage.getItem("chatUser");
    if (stored) {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      connectSocket(user._id);
    }
  }, []);

  /* =========================
     FETCH FRIENDS LIST
  ========================= */
  useEffect(() => {
    const fetchFriends = async () => {
      if (!currentUser?._id) return;

      try {
        setLoadingFriends(true);

        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users?currentUserId=${currentUser._id}`,
          {
            credentials: "include"
          }
        );

        const data = await res.json();
        setFriends(data);

        if (!selectedFriendId && data.length > 0) {
          setSelectedFriendId(data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoadingFriends(false);
      }
    };

    fetchFriends();
  }, [currentUser, selectedFriendId]);

  /* =========================
     NOT LOGGED IN
  ========================= */
  if (!currentUser) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-slate-300 text-sm">
        Please login first to start chatting.
      </div>
    );
  }

  const selectedFriend =
    friends.find((f) => f._id === selectedFriendId) || null;

  /* =========================
     UI
  ========================= */
  return (
    <section className="mt-6">
      <div className="h-[80vh] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-indigo-500/20 overflow-hidden">
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-white/10 bg-slate-950/70">
            <FriendsSidebar
              friends={friends}
              selectedFriendId={selectedFriendId}
              onSelectFriend={setSelectedFriendId}
              loading={loadingFriends}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 border-r border-white/10 bg-slate-950/40">
            <ChatContainer
              currentUserId={currentUser._id}
              friend={selectedFriend}
            />
          </div>

          {/* Profile Panel */}
          <div className="hidden md:block w-72 bg-slate-950/70">
            <UserProfilePanel friend={selectedFriend} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
