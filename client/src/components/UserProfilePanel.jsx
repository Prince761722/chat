const UserProfilePanel = ({ friend }) => {
  if (!friend) {
    return (
      <div className="h-full flex items-center justify-center text-[11px] text-slate-400">
        Select a chat to view profile details.
      </div>
    );
  }

  const { name, handle, online, bio, stats } = friend;
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-white/10 px-4 flex items-center">
        <p className="text-sm font-semibold tracking-tight">Chat Details</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-sky-400 via-indigo-400 to-violet-500 flex items-center justify-center text-2xl font-semibold">
              {firstLetter}
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
                online ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-[11px] text-slate-400">{handle}</p>
            <p className="mt-1 text-[11px] text-emerald-400">
              {online ? "online" : "offline"}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <p className="text-[11px] text-slate-300 font-medium">Bio</p>
          <p className="text-[11px] text-slate-400">
            {bio || "No bio added yet."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="rounded-2xl bg-white/5 border border-white/10 px-2 py-2">
            <p className="text-base font-semibold">{stats?.messages ?? 0}</p>
            <p className="text-slate-400">Msgs</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-2 py-2">
            <p className="text-base font-semibold">{stats?.days ?? 0}</p>
            <p className="text-slate-400">Days</p>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 px-2 py-2">
            <p className="text-base font-semibold">{stats?.groups ?? 0}</p>
            <p className="text-slate-400">Groups</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 text-[11px]">
          <button className="w-full rounded-2xl border border-white/15 bg-white/5 py-2 hover:bg-white/10 transition">
            View shared media
          </button>
          <button className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 py-2 text-red-300 hover:bg-red-500/20 transition">
            Block / Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
