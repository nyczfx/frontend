"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar) setAvatar(savedAvatar);

    function syncAvatar() {
      const updated = localStorage.getItem("user_avatar");
      setAvatar(updated);
    }

    window.addEventListener("storage", syncAvatar);
    return () => window.removeEventListener("storage", syncAvatar);
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-end px-6 py-4 border-b border-neutral-800 bg-[#0a0a0a]">
      
      {/* SEARCH BAR */}
      <div className="flex-1 flex justify-center">
        <div className="w-[350px] flex items-center bg-[#111] border border-neutral-800 text-neutral-400 px-4 py-2 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-neutral-500 transition-all">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent outline-none text-sm text-neutral-200"
          />
        </div>
      </div>

      {/* AVATAR */}
      <div className="ml-6">
        <div
          onClick={handleLogout}
          title="Sair"
          className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden ring-1 ring-neutral-600 shadow hover:ring-red-400 transition cursor-pointer"
        >
          {avatar ? (
            <img
              src={avatar}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">
              ?
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
