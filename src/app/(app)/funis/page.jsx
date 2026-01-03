"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Copy,
  Trash2,
  Workflow,
  MessageCircle,
} from "lucide-react";

export default function FunisPage() {
  const router = useRouter();

  const [funis, setFunis] = useState([
    {
      id: "1",
      nome: "Funil Boas Vindas",
      descricao: "Fluxo inicial para novos leads",
      steps: 2,
      integracao: "WhatsApp",
      versao: "1.0",
    },
  ]);

  const criarFunil = () => {
    const novo = {
      id: crypto.randomUUID(),
      nome: "Novo Funil",
      descricao: "Descreva seu funil",
      steps: 0,
      integracao: "WhatsApp",
      versao: "1.0",
    };
    setFunis((prev) => [...prev, novo]);
  };

  const duplicarFunil = (f) => {
    setFunis((prev) => [
      ...prev,
      {
        ...f,
        id: crypto.randomUUID(),
        nome: `${f.nome} (Cópia)`,
      },
    ]);
  };

  const deletarFunil = (id) => {
    setFunis((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] p-10 text-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">Funis</h1>
          <p className="text-gray-400">Gerencie suas automações</p>
        </div>

        <button
          onClick={criarFunil}
          className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-medium"
        >
          <Plus size={18} /> Novo Funil
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {funis.map((f) => (
          <div
            key={f.id}
            className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between mb-2">
                <h2 className="font-semibold">{f.nome}</h2>
                <span className="text-xs bg-[#1c1c1c] px-2 py-1 rounded-lg">
                  v{f.versao}
                </span>
              </div>

              <p className="text-sm text-gray-400 min-h-[40px]">
                {f.descricao}
              </p>

              <div className="flex justify-between text-xs text-gray-300 mt-4">
                <span>{f.steps} steps</span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={14} />
                  {f.integracao}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-6">
              <button
                onClick={() => router.push(`/funis/${f.id}`)}
                className="border rounded-lg py-2"
              >
                <Workflow size={16} className="mx-auto" />
              </button>

              <button className="border rounded-lg py-2">
                <Edit2 size={16} className="mx-auto" />
              </button>

              <button
                onClick={() => duplicarFunil(f)}
                className="border rounded-lg py-2"
              >
                <Copy size={16} className="mx-auto" />
              </button>

              <button
                onClick={() => deletarFunil(f.id)}
                className="border border-red-800 rounded-lg py-2"
              >
                <Trash2 size={16} className="mx-auto text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
