"use client";

import React, { useState, useEffect } from "react";

export default function IntegracaoPage() {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const API = "https://studdy-8yb8.onrender.com";

  // --------------------------------------
  // 🔥 STATUS REAL DO BACKEND (POLLING)
  // --------------------------------------
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API}/wa/status`);
        const data = await res.json();

        if (data?.status === "connected") {
          setConnected(true);
          setQrCode(null); // remove o QR da tela quando conectar
        } else {
          setConnected(false);
        }
      } catch (err) {
        console.error("Erro ao buscar status", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------
  // 🔥 GERAR QR CODE
  // --------------------------------------
  const generateQR = async () => {
    setLoading(true);
    setQrCode(null);

    try {
      const res = await fetch(`${API}/wa/qr`, { method: "GET" });
      const data = await res.json();

      if (data?.qr) {
        setQrCode(data.qr);
      } else {
        alert("QR Code ainda não disponível. Abra o bot!");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar QR Code");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2 tracking-tight">Integração</h1>

      <p className="text-neutral-400 mb-10 text-sm">
        Conecte sua conta do WhatsApp para utilizar automações e envios em tempo real.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* CARD CONECTAR WHATSAPP */}
        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-8 shadow-xl shadow-black/30">
          <h2 className="text-lg font-semibold mb-4">Conectar WhatsApp</h2>

          <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
            Clique abaixo para gerar um QR Code e conectar seu WhatsApp à plataforma.
          </p>

          {/* BOTÃO GERAR QR */}
          {!qrCode && !connected && (
            <button
              onClick={generateQR}
              className="bg-white text-black px-5 py-3 rounded-xl w-full font-semibold hover:bg-neutral-200 transition"
            >
              {loading ? "Gerando QR Code..." : "Gerar QR Code"}
            </button>
          )}

          {/* QR CODE */}
          {qrCode && !connected && (
            <div className="flex flex-col items-center mt-6">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-64 h-64 rounded-xl border border-neutral-700 shadow-md"
              />

              <p className="text-neutral-400 text-xs mt-4">
                Escaneie o QR Code com o WhatsApp para conectar.
              </p>
            </div>
          )}

          {/* STATUS CONECTADO */}
          {connected && (
            <div className="mt-6 bg-green-800/30 border border-green-500 text-green-400 p-4 rounded-xl text-center">
              ✓ WhatsApp conectado com sucesso!
            </div>
          )}
        </div>

        {/* CARD STATUS */}
        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-8 shadow-xl shadow-black/30 h-fit">
          <h2 className="text-lg font-semibold mb-4">Status da Integração</h2>

          <div className="space-y-3">
            <div className="bg-black border border-neutral-700 rounded-xl p-4">
              <p className="font-semibold">Status do WhatsApp</p>
              <p className="text-neutral-400 text-sm">
                {connected ? "Conectado ✔" : "Desconectado"}
              </p>
            </div>

            <div className="bg-black border border-neutral-700 rounded-xl p-4">
              <p className="font-semibold">Acesso à plataforma</p>
              <p className="text-neutral-400 text-sm">
                {connected ? "Liberado" : "Aguardando conexão"}
              </p>
            </div>

            <div className="bg-black border border-neutral-700 rounded-xl p-4">
              <p className="font-semibold">Última sincronização</p>
              <p className="text-neutral-400 text-sm">
                {connected ? "Agora mesmo" : "Nenhuma sincronização"}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
