import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");

function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch {
    return {
      contacts: [],
      messages: [],
      audios: [],
      leads: [],
      extractionsHistory: []
    };
  }
}

export async function GET() {
  const db = readDB();

  const stats = {
    contacts: db.contacts?.length || 0,
    messages: db.messages?.length || 0,
    audios: db.audios?.length || 0,
    leads: db.leads?.length || 0,
  };

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
