import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dbPath = path.resolve(process.cwd(), "backend", "db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const now = new Date();

  const startToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  const endToday = startToday + 86400000;

  const messagesToday = (db.messages || []).filter(m => {
    const t = new Date(m.date).getTime();
    return t >= startToday && t < endToday;
  }).length;

  const audiosToday = (db.audios || []).filter(a => {
    const t = new Date(a.date).getTime();
    return t >= startToday && t < endToday;
  }).length;

  const contacts = db.contacts?.length || db.contatos?.length || 0;

  return NextResponse.json({
    status: "online",
    messagesToday,
    audiosToday,
    contacts
  });
}
