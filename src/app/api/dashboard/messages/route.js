import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filePath = path.resolve(process.cwd(), "backend", "db.json");
    const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const messages = db.messages || [];

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Erro ao ler mensagens:", err);
    return NextResponse.json([], { status: 500 });
  }
}
