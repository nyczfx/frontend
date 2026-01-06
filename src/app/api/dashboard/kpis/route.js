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
    return {
      contacts: [],
      messages: [],
      audios: [],
    };
  }
}

export async function GET() {
  const db = readDB();

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Mensagens de hoje
  const messagesToday = (db.messages || []).filter(m => m.date?.startsWith(today)).length;

  // Áudios de hoje
  const audiosToday = (db.audios || []).filter(a => a.date?.startsWith(today)).length;

  // Total de contatos
  const contacts = db.contacts?.length || 0;

  // Status fixo (você pode integrar WhatsApp depois)
  const status = "online";

  return NextResponse.json({
    status,
    messagesToday,
    audiosToday,
    contacts,
  });
}
