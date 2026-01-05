"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada com sucesso");
    router.push("/login");
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-8 space-y-6">

        <div className="text-center">
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="text-gray-400 text-sm mt-1">
            Crie sua conta para acessar o painel
          </p>
        </div>

        {/* GOOGLE */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-2.5 rounded-xl font-medium hover:opacity-90 transition"
        >
          <FcGoogle size={20} />
          Continuar com Google
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px bg-[#2a2a2a] flex-1" />
          <span className="text-xs text-gray-500">ou</span>
          <div className="h-px bg-[#2a2a2a] flex-1" />
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 outline-none focus:border-white/40"
          />

          <input
            name="senha"
            type="password"
            placeholder="Senha"
            required
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 outline-none focus:border-white/40"
          />

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Criar conta
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <a href="/login" className="text-white hover:underline">
            Entrar
          </a>
        </p>

      </div>
    </div>
  );
}
