import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../../lib/users";

export async function POST(req) {
  const { email, senha } = await req.json();

  const user = findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const ok = await bcrypt.compare(senha, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("auth", user.id.toString(), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return res;
}
