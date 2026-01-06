import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Função para ler o db.json dentro da pasta backend
function readDB() {
  try {
    const dbPath = path.resolve(process.cwd(), "backend", "db.json");
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (err) {
    console.error("Erro ao ler backend/db.json:", err);
    return { messages: [], audios: [] };
  }
}

export async function GET() {
  const db = readDB();
  const now = new Date();

  // Array com os últimos 30 dias
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (29 - i)
    );
    return d.toISOString().split("T")[0];
  });

  // Monta os dados do gráfico
  const data = days.map(day => ({
    date: day,
    messages: (db.messages || []).filter(m => m.date?.startsWith(day)).length,
    audios: (db.audios || []).filter(a => a.date?.startsWith(day)).length,
  }));

  return NextResponse.json(data);
}
