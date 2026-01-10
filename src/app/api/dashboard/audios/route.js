import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

function readDB() {
  try {
    const dbPath = path.resolve(process.cwd(), "backend", "db.json"); // seu db.json
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  } catch (err) {
    console.error("Erro ao ler backend/db.json:", err);
    return { audios: [] };
  }
}

export async function GET() {
  const db = readDB();
  const now = new Date();

  // Últimos 30 dias
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  // Contagem de áudios por dia
  const data = days.map(day => ({
    day: day.slice(8, 10), // só o dia
    audios: (db.audios || []).filter(a => a.date?.startsWith(day)).length,
  }));

  return NextResponse.json(data);
}
