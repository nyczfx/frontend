"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, created_at")
        .order("created_at", { ascending: false });

      console.log(data, error);

      if (!error) setUsers(data);
    }

    load();
  }, []);

  return (
    <div>
      <h2>Clientes cadastrados</h2>

      {users.map(u => (
        <div key={u.id}>
          <strong>{u.email}</strong>
          <br />
          <small>
            Criado em {new Date(u.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
