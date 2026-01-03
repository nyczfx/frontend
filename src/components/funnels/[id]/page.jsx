// src/app/funnels/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import FunnelBuilder from "@/components/FunnelBuilder";
import FunnelHistory from "@/components/FunnelHistory";
import FunnelVersions from "@/components/FunnelVersions";

export default function FunnelDetails() {
  const [funnel, setFunnel] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = params.id;
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3001/funnels/${id}`);
    const data = await res.json();
    setFunnel(data || null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!funnel) return <div className="p-8">Funil não encontrado</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{funnel.name}</h1>
          <p className="text-neutral-400">{funnel.description}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push(`/funis/${id}/edit`)} className="px-4 py-2 bg-white text-black rounded">Editar fluxo</button>
          <button onClick={load} className="px-4 py-2 bg-neutral-800 rounded">Atualizar</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#0b0b0b] border border-neutral-800 rounded p-4">
          <FunnelBuilder funnel={funnel} onSave={load} />
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-[#0b0b0b] border border-neutral-800 rounded p-4">
            <h3 className="font-bold mb-2">Histórico</h3>
            <FunnelHistory funnelId={id} />
          </div>

          <div className="bg-[#0b0b0b] border border-neutral-800 rounded p-4">
            <h3 className="font-bold mb-2">Versões</h3>
            <FunnelVersions funnelId={id} onRestore={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
