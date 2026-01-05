import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const dbPath = path.resolve(process.cwd(), "backend", "db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  const now = new Date();

  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - (29 - i)
      )
    );

    return {
      date: d.toISOString().slice(0, 10),
      start: d.getTime(),
      end: d.getTime() + 86400000
    };
  });

  const data = days.map(day => ({
    date: day.date,
    messages: (db.messages || []).filter(m => {
      const t = new Date(m.date).getTime();
      return t >= day.start && t < day.end;
    }).length,
    audios: (db.audios || []).filter(a => {
      const t = new Date(a.date).getTime();
      return t >= day.start && t < day.end;
    }).length
  }));

  return NextResponse.json(data);
}
