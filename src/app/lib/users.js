import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const filePath = path.join(process.cwd(), "src/app/lib/users.json");

// Garante que o arquivo existe
function loadUsers() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export async function createUser(email, password) {
  const users = loadUsers();

  const exists = users.find(u => u.email === email);
  if (exists) {
    throw new Error("Usuário já existe");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    email,
    password: hash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  return user;
}

export function findUserByEmail(email) {
  const users = loadUsers();
  return users.find(u => u.email === email);
}
