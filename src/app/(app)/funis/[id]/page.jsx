"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function FunilEditor({ params }) {
  const router = useRouter();
  const { id } = params;

  const [steps, setSteps] = useState([]);
  const [editando, setEditando] = useState(false);
  const [stepsBackup, setStepsBackup] = useState([]);

  /* =========================
     CARREGAR FUNIL
  ========================== */
  useEffect(() => {
    const salvo = localStorage.getItem(`funil-${id}`);
    if (salvo) {
      setSteps(JSON.parse(salvo));
    } else {
      setSteps([
        { id: crypto.randomUUID(), tipo: "mensagem", conteudo: "Olá! Seja bem-vindo 👋" },
      ]);
    }
  }, [id]);

  /* =========================
     AÇÕES
  ========================== */
  const adicionarMensagem = () => {
    setSteps((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tipo: "mensagem", conteudo: "" },
    ]);
  };

  const adicionarDelay = () => {
    setSteps((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tipo: "delay", conteudo: "1 minuto" },
    ]);
  };

  const removerStep = (stepId) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
  };

  const editarConteudo = (id, valor) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, conteudo: valor } : s
      )
    );
  };

  const iniciarEdicao = () => {
    setStepsBackup(JSON.parse(JSON.stringify(steps)));
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setSteps(stepsBackup);
    setEditando(false);
  };

  const salvarFunil = () => {
    localStorage.setItem(`funil-${id}`, JSON.stringify(steps));
    setEditando(false);
    alert("Funil salvo 🔥");
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-[#0b0b0b] p-10 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/funis")}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        {!editando ? (
          <button
            onClick={iniciarEdicao}
            className="px-4 py-2 bg-white text-black rounded-xl"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={salvarFunil}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-xl"
            >
              <Save size={16} /> Salvar
            </button>

            <button
              onClick={cancelarEdicao}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl"
            >
              <X size={16} /> Cancelar
            </button>
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-8">
        Editor de Funil
      </h1>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4"
          >
            <div className="flex justify-between mb-2">
              <p className="text-xs text-gray-400 uppercase">
                Step {i + 1} • {s.tipo}
              </p>

              {editando && (
                <button onClick={() => removerStep(s.id)}>
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
            </div>

            {s.tipo === "mensagem" ? (
              editando ? (
                <textarea
                  value={s.conteudo}
                  onChange={(e) =>
                    editarConteudo(s.id, e.target.value)
                  }
                  className="w-full bg-[#0b0b0b] border border-[#222] rounded-lg p-3"
                  rows={3}
                />
              ) : (
                <p>{s.conteudo}</p>
              )
            ) : (
              editando ? (
                <input
                  value={s.conteudo}
                  onChange={(e) =>
                    editarConteudo(s.id, e.target.value)
                  }
                  className="bg-[#0b0b0b] border border-[#222] rounded-lg p-2"
                />
              ) : (
                <p>Delay: {s.conteudo}</p>
              )
            )}
          </div>
        ))}
      </div>

      {/* Ações */}
      {editando && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={adicionarMensagem}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl"
          >
            <Plus size={16} /> Mensagem
          </button>

          <button
            onClick={adicionarDelay}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl"
          >
            <Plus size={16} /> Delay
          </button>
        </div>
      )}
    </div>
  );
}
