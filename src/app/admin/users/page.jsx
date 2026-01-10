"use client";

import { useState } from "react";

export default function AdminCreateUser() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Erro ao criar usuário");
      return;
    }

    alert("Usuário criado com sucesso 🚀");
    setEmail("");
    setSenha("");
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#161616] p-8 rounded-xl border border-zinc-800">
        <h1 className="text-white text-2xl font-bold mb-2">
          Gerar acesso
        </h1>
        <p className="text-zinc-400 mb-6">
          Criar email e senha direto no sistema
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="email"
            placeholder="Email do usuário"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:outline-none"
          />

          <input
            type="text"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:outline-none"
          />

          <button
            disabled={loading}
            className="w-full py-3 bg-white text-black font-semibold rounded-md hover:opacity-90 transition"
          >
            {loading ? "Criando..." : "Gerar acesso"}
          </button>
        </form>
      </div>
    </div>
  );
}
