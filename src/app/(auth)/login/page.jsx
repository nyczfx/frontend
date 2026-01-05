"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // certifique que a lib aponta pra src/lib/supabase.js

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    // LOGIN DIRETO COM SUPABASE
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      alert(error.message || "Email ou senha inválidos");
      return;
    }

    // redireciona direto para o início do SaaS
    router.push("/inicio");
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/inicio`,
      },
    });
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Bem-vindo</h1>
        <p>Faça login para acessar o painel</p>

        {/* BOTÃO GOOGLE */}
        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-2.5 rounded-xl font-medium hover:opacity-90 transition mb-4"
        >
          Continuar com Google
        </button>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="senha" type="password" placeholder="Senha" required />

          <button type="submit">Entrar</button>

          <p className="login-register">
            Não tem uma conta? <Link href="/register">Cadastre-se</Link>
          </p>
        </form>

        <span className="login-footer">© 2026 • Studdy</span>
      </div>
    </div>
  );
}
