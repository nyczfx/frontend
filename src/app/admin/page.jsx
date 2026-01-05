"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EnviosChart from "@/components/EnviosChart";

import { Activity, Users, UserPlus, UserCheck, ArrowUpRight } from "lucide-react";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [kpis, setKpis] = useState({
    status: "offline",
    total: 0,
    today: 0,
    active: 0
  });

  // Carrega usuários do Supabase
  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, provider, role, banned, created_at, last_login")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar usuários:", error.message);
      return;
    }

    setUsers(data);

    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startWeek = new Date();
    startWeek.setDate(startWeek.getDate() - 7);

    const todayCount = data.filter(u => new Date(u.created_at) >= startToday).length;
    const activeCount = data.filter(u => new Date(u.last_login) >= startWeek).length;

    setKpis({
      status: "online",
      total: data.length,
      today: todayCount,
      active: activeCount
    });

    // gráfico últimos 30 dias
    const days = Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().slice(0, 10),
        value: data.filter(u => new Date(u.created_at).toISOString().slice(0, 10) === d.toISOString().slice(0, 10)).length
      };
    });

    setGraphData(days);
  }

  useEffect(() => {
    loadUsers();

    const channel = supabase
      .channel("admin-users")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles"
        },
        loadUsers
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-8 text-white space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Painel Administrativo</h1>
        <p className="text-gray-400 mt-1">Visão geral dos usuários da plataforma</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Status do Sistema" value={kpis.status} sub="Supabase" accent="text-green-400" icon={<Activity size={22} />} />
        <Card title="Usuários Totais" value={kpis.total} sub="Base completa" icon={<Users size={22} />} />
        <Card title="Novos Hoje" value={kpis.today} sub="Últimas 24h" icon={<UserPlus size={22} />} />
        <Card title="Usuários Ativos" value={kpis.active} sub="Últimos 7 dias" icon={<UserCheck size={22} />} />
      </div>

      {/* DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Novos Usuários (30 dias)</h2>
            <span className="text-xs text-gray-400">Cadastros por dia</span>
          </div>

          <EnviosChart data={graphData} />
        </div>

        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-medium">Métricas Rápidas</h2>
          <Metric label="Taxa de Crescimento" value="+12%" accent="text-green-400" />
          <Metric label="Conversão Free → Pro" value="—" />
          <Metric label="Churn" value="0%" accent="text-green-400" />
        </div>
      </div>

      {/* USUÁRIOS */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
        <h2 className="text-lg font-medium mb-4">Usuários Cadastrados</h2>
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
          {users.map(user => (
            <div key={user.id} className="flex justify-between items-center bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Provider: {user.provider} • Role: {user.role} • Criado em {new Date(user.created_at).toLocaleString()}
                </p>
                {user.last_login && <p className="text-xs text-gray-400">Último login: {new Date(user.last_login).toLocaleString()}</p>}
                {user.banned && <p className="text-xs text-red-400">BANIDO</p>}
              </div>
              <span className={`text-xs ${!user.banned ? "text-green-400" : "text-red-400"}`}>
                {!user.banned ? "Ativo" : "Bloqueado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AÇÕES */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
        <h2 className="text-lg font-medium mb-4">Ações Administrativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Action title="Gerenciar Usuários" desc="Bloqueie, edite ou promova usuários." />
          <Action title="Planos e Pagamentos" desc="Controle assinaturas e limites." />
          <Action title="Logs do Sistema" desc="Auditoria e eventos críticos." />
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
        <p className={`text-2xl font-semibold ${accent || ""}`}>{value}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
      <div className="text-gray-500">{icon}</div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={accent || "text-white"}>{value}</span>
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
