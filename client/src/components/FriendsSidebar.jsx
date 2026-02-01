const FriendsSidebar = ({ friends, currentFriend, setCurrentFriend }) => {
  return (
    <div className="w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-xl h-full flex flex-col">
      <div className="px-4 py-3 border-b border-white/10">
        <h2 className="text-lg font-semibold tracking-tight">Chats</h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {friends.length === 0 && (
          <p className="text-center text-xs text-slate-400 mt-4">
            No users available
          </p>
        )}

        {friends.map((friend) => (
          <button
            key={friend._id}
            onClick={() => setCurrentFriend(friend)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition text-left ${
              currentFriend?._id === friend._id ? "bg-white/10" : ""
            }`}
          >
            {/* Avatar */}
            <img
              src={
                friend.avatar ||
                "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
              }
              alt="avatar"
              className="h-10 w-10 rounded-full object-cover border border-white/10"
            />

            <div className="flex-1">
              <p className="text-sm font-medium">{friend.name}</p>
              <p
                className={`text-[11px] ${
                  friend.isOnline ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {friend.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FriendsSidebar;
