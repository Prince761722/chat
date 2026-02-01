import { useEffect, useState } from "react";
import { socket } from "../socket";

const Profile = () => {
  const stored = localStorage.getItem("chatUser");
  const user = stored ? JSON.parse(stored) : null;

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.avatar) setAvatar(user.avatar);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadAvatar = async () => {
    if (!file) {
      alert("Please select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setSaving(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/update-avatar`,
        {
          method: "POST",
          headers: {
            "x-user-id": user._id
          },
          credentials: "include",
          body: formData
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Upload failed.");
        return;
      }

      setAvatar(data.avatar);
      localStorage.setItem("chatUser", JSON.stringify(data));
      alert("Profile picture updated!");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    if (socket?.connected) socket.disconnect();
    window.location.href = "/login";
  };

  if (!user) {
    return (
      <div className="text-center text-sm text-slate-300">
        Please login first.
      </div>
    );
  }

  const avatarSrc = avatar
    ? avatar.startsWith("http")
      ? avatar
      : `${process.env.REACT_APP_API_URL}${avatar}`
    : "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";

  return (
    <section className="flex items-center justify-center mt-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-lg shadow-sky-500/20">
        <h2 className="text-xl font-semibold text-center mb-4">
          Your Profile
        </h2>

        <div className="flex flex-col items-center gap-4">
          {/* Avatar Preview */}
          <img
            src={avatarSrc}
            alt="Avatar"
            className="h-28 w-28 rounded-full border border-white/20 object-cover shadow"
          />

          {/* Upload Button */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-xs text-slate-300"
          />

          <button
            onClick={uploadAvatar}
            disabled={saving}
            className="mt-1 bg-sky-500 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-sky-400 transition shadow-md disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Picture"}
          </button>
        </div>

        <div className="mt-6 text-sm text-slate-300">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.username}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 py-2 rounded-xl text-sm font-semibold hover:bg-red-400 transition"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default Profile;
