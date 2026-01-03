"use client";

import { useState } from "react";

export default function WhatsAppIntegration() {
  const [modal, setModal] = useState(false);
  const [status, setStatus] = useState({});
  const [qr, setQr] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);

  const fetchStatus = async () => {
    const res = await fetch("http://localhost:3001/wa/status");
    const data = await res.json();
    setStatus(data);
  };

  const fetchQR = async () => {
    setLoadingQR(true);
    setQr(null);

    const res = await fetch("http://localhost:3001/wa/qr");
    const data = await res.json();

    setQr(data.qr || null);
    setLoadingQR(false);
  };

  const clearSession = async () => {
    await fetch("http://localhost:3001/wa/clear-session", { method: "POST" });
    alert("Sessão limpa. Gere um novo QR.");
    setQr(null);
    fetchStatus();
  };

  return (
    <>
      {/* BOTÃO */}
      <button
        onClick={() => {
          fetchStatus();
          setModal(true);
        }}
        className="px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition text-sm"
      >
        Integrar WhatsApp
      </button>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-[#0f0f0f] p-6 rounded-2xl border border-neutral-700 w-full max-w-xl">
            
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Integração WhatsApp</h2>
              <button
                className="px-2 py-1 bg-neutral-800 rounded"
                onClick={() => setModal(false)}
              >
                Fechar
              </button>
            </div>

            {/* STATUS */}
            <p className="text-sm opacity-70 mb-2">Status do Bot:</p>
            <pre className="bg-black/40 p-3 rounded text-sm mb-4 border border-white/10">
              {JSON.stringify(status, null, 2)}
            </pre>

            {/* QR CODE */}
            {!qr && (
              <div>
                <button
                  onClick={fetchQR}
                  className="px-4 py-2 bg-white text-black rounded"
                >
                  Obter QR
                </button>

                {loadingQR && (
                  <p className="text-sm mt-3 opacity-70">Gerando QR...</p>
                )}
              </div>
            )}

            {qr && (
              <div className="flex justify-center mt-4">
                <div className="p-4 bg-black/20 rounded-xl border border-white/10">
                  <img
                    src={qr}
                    className="w-40 h-40 object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => {
                  fetchStatus();
                  fetchQR();
                }}
                className="px-4 py-2 bg-neutral-800 rounded"
              >
                Atualizar status / QR
              </button>

              <button
                onClick={clearSession}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Limpar sessão
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
