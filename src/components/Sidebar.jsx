"use client";

import Link from "next/link";
import {
  Home,
  MessageCircle,
  Mic,
  Phone,
  Workflow,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-20 bg-[#0d0d0d] border-r border-neutral-900 flex flex-col items-center py-6 gap-8">

      <Link href="/inicio" className="p-3 rounded-xl hover:bg-neutral-800 transition">
        <Home size={26} />
      </Link>

      <Link href="/mensagens" className="p-3 rounded-xl hover:bg-neutral-800 transition">
        <MessageCircle size={26} />
      </Link>

      <Link href="/audios" className="p-3 rounded-xl hover:bg-neutral-800 transition">
        <Mic size={26} />
      </Link>

      {/* 🔥 BOTÃO DE INTEGRAÇÃO — WHATSAPP */}
      <Link href="/integracao" className="p-3 rounded-xl hover:bg-neutral-800 transition">
        <Phone size={26} />
      </Link>

      {/* NOVA PAGE DE CONVERSÃO */}
      <Link href="/converter" className="p-3 rounded-xl hover:bg-neutral-800 transition">
        <Workflow size={26} />
      </Link>

      <Link href="/configuracoes" className="p-3 rounded-xl hover:bg-neutral-800 transition mt-auto">
        <Settings size={26} />
      </Link>

    </aside>
  );
}
