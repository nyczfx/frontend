import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parse } from "json2csv"; // npm install json2csv
import bot from "@/backend/bot"; // ajuste conforme o caminho real do seu bot.js

// ----------------------------
// PATH DO DB (JSON)
const DB_PATH = path.join(process.cwd(), "backend/db.json");

// ----------------------------
// FUNÇÃO PRA LER O DB
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return { contacts: [], leads: [], messages: [], audios: [] };
  }
}

// ----------------------------
// FUNÇÃO PRA ESCREVER NO DB
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ----------------------------
// ROTA POST: EXTRAIR CONTATOS
export async function POST(req) {
  try {
    const body = await req.json();
    const { groupLink, amount } = body;

    if (!groupLink) return NextResponse.json({ ok: false, error: "Informe o link do grupo" });

    // ----------------------------
    // EXTRACAO DE ID DO GRUPO
    let groupId;
    try {
      const regex = /chat\.whatsapp\.com\/([a-zA-Z0-9]+)/;
      const match = groupLink.match(regex);
      if (!match) throw new Error("Link inválido");
      groupId = match[1] + "@g.us"; // formato do Baileys
    } catch {
      return NextResponse.json({ ok: false, error: "Link inválido" });
    }

    // ----------------------------
    // EXTRAIR CONTATOS COM RETRY
    let contacts = [];
    let attempts = 0;
    while (attempts < 3) {
      try {
        contacts = await bot.extractGroupContacts(groupId, amount);
        break; // sucesso
      } catch (err) {
        attempts++;
        console.warn(`❌ Tentativa ${attempts} falhou:`, err.message);
        if (attempts >= 3) throw new Error("Não foi possível extrair contatos");
        await new Promise(r => setTimeout(r, 2000)); // espera 2s
      }
    }

    // ----------------------------
    // SALVAR CONTATOS NO DB
    const db = readDB();
    contacts.forEach(number => {
      if (!db.contacts.find(c => c.number === number)) {
        db.contacts.push({ id: Date.now() + Math.random(), number, name: "", tag: "", notes: "" });
      }
    });
    writeDB(db);

    // ----------------------------
    // GERAR CSV
    const csv = parse(contacts.map(n => ({ number: n })));

    return NextResponse.json({ ok: true, contacts, csv });

  } catch (err) {
    console.error("❌ Erro em /dashboard/extractions:", err);
    return NextResponse.json({ ok: false, error: err.message || "Erro desconhecido" });
  }
}
