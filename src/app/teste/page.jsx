"use client";
import { useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function Teste() {
  useEffect(() => {
    async function run() {
      const { data, error } = await supabase
        .from("contacts")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    run();
  }, []);

  return <div>Teste Supabase</div>;
}
