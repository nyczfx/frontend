"use client";

import { useEffect, useState } from "react";
import EnviosChart from "@/components/EnviosChart";
import {
  Activity,
  MessageCircle,
  Mic,
  Users,
  ArrowUpRight,
} from "lucide-react";

export default function Inicio() {
  const [graphData, setGraphData] = useState([]);
  const [kpis, setKpis] = useState({
    status: "offline",
    messagesToday: 0,
    audiosToday: 0,
    contacts: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Pega os dados do gráfico dos últimos 30 dias
        const graph = await fetch(`/api/dashboard/graph`).then(r => r.json());

        // Pega os KPIs (status, messagesToday, audiosToday, contacts)
        const kpiData = await fetch(`/api/dashboard/kpis`).then(r => r.json());

        // Atualiza o gráfico
        setGraphData(graph);

        // Atualiza KPIs
        setKpis({
          status: kpiData.status,
          messagesToday: kpiData.messagesToday,
          audiosToday: kpiData.audiosToday,
          contacts: kpiData.contacts,
        });
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 text-white space-y-8">

      {/* SAUDAÇÃO */}
      <div>
        <h1 className="text-3xl font-semibold">Bem-vindo ao Studdy</h1>
        <p className="text-gray-400 mt-1">
          Visão geral da sua operação no WhatsApp
        </p>
      </div>

      {/* STATUS + KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="Status da Ferramenta"
          value={kpis.status === "online" ? "Online" : "Offline"}
          sub="Conexão com WhatsApp"
          accent={kpis.status === "online" ? "text-green-400" : "text-red-400"}
          icon={<Activity size={22} />}
        />
        <Card
          title="Mensagens Hoje"
          value={kpis.messagesToday}
          sub="Envios realizados hoje"
          icon={<MessageCircle size={22} />}
        />
        <Card
          title="Áudios Hoje"
          value={kpis.audiosToday}
          sub="Envios naturais"
          icon={<Mic size={22} />}
        />
        <Card
          title="Contatos Ativos"
          value={kpis.contacts}
          sub="Base atual"
          icon={<Users size={22} />}
        />
      </div>

      {/* DASHBOARD (OCUPA TODO O ESPAÇO) */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">
            Envios dos Últimos 30 Dias
          </h2>
          <span className="text-xs text-gray-400">
            Mensagens × Áudios
          </span>
        </div>

        <EnviosChart data={graphData} />
      </div>

      {/* AÇÕES */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
        <h2 className="text-lg font-medium mb-4">
          O que você pode fazer agora?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Action title="Disparar Mensagens" desc="Envios em massa com controle total." />
          <Action title="Enviar Áudios" desc="Áudios naturais direto no WhatsApp." />
          <Action title="Gerenciar Contatos" desc="Organize e segmente sua base." />
        </div>
      </div>

    </div>
  );
}

/* COMPONENTES */

function Card({ title, value, sub, icon, accent }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className={`text-2xl font-semibold ${accent || ""}`}>
          {value}
        </p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
      <div className="text-gray-500">{icon}</div>
    </div>
  );
}

function Action({ title, desc }) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-5 hover:border-white/20 transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <ArrowUpRight size={16} />
      </div>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  );
}
