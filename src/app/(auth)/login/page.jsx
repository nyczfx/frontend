"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (res.ok) {
      if (res.ok) {
  router.push("/inicio");
}
 // ou /audios
    } else {
      alert("Email ou senha inválidos");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Bem-vindo</h1>
        <p>Faça login para acessar o painel</p>

        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="senha" type="password" placeholder="Senha" required />

          <button type="submit">Entrar</button>

          <p className="login-register">
            Não tem uma conta?{" "}
            <Link href="/register">Cadastre-se</Link>
          </p>
        </form>

        <span className="login-footer">© 2026 • Studdy</span>
      </div>
    </div>
  );
}
