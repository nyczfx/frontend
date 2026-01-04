"use client";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const senha = e.target.senha.value;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (res.ok) {
      alert("Conta criada com sucesso");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Criar conta</h1>
        <p>Cadastre-se para acessar o painel</p>

        <form onSubmit={handleRegister}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="senha" type="password" placeholder="Senha" required />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}
