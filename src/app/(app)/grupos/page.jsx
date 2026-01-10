"use client";

import React, { useState } from "react";
import { Download, FileText, Info, CheckCircle, UserPlus } from "lucide-react";

export default function GruposDashboardPage() {
  // ----------------------------
  // ESTADOS DE IMPORTAÇÃO CSV
  const [csvFile, setCsvFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [fileReady, setFileReady] = useState(false);
  const [error, setError] = useState("");
  const [uniqueCount, setUniqueCount] = useState(0);

  // ----------------------------
  // FUNÇÃO DE IMPORTAR CSV
  const handleCsvUpload = (e) => {
    setError("");
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      setError("Por favor, envie um arquivo CSV válido.");
      return;
    }
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;

      // Remove espaços extras, quebra por linha e filtra vazios
      const lines = text
        .split(/\r\n|\n/)
        .flatMap(line => line.split(",").map(num => num.trim()))
        .filter(Boolean);

      // Cria contatos simples só com número
      const parsed = lines.map((num, index) => ({
        nome: `Cliente ${index + 1}`,
        numero: num
      }));

      setContacts(parsed);
      setFileReady(true);

      // Contagem de números únicos
      const uniqueNums = new Set(parsed.map(c => c.numero));
      setUniqueCount(uniqueNums.size);
    };
    reader.readAsText(file);
  };

  // ----------------------------
  // GERAR CSV ORGANIZADO (1 NÚMERO POR LINHA)
  const downloadCsv = () => {
    if (!contacts.length) return;
    const rows = contacts.map(c => c.numero); // só os números
    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `numeros-organizados-${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-black text-white px-8 py-10 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Organizador de Contatos CSV</h1>
        <p className="text-gray-400 max-w-2xl">
          Importe arquivos CSV com números de telefone, organize-os e baixe prontos para uso.
        </p>
      </div>

      {/* CARDS INFORMATIVOS ÚTEIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <InfoCard 
          title="Como Usar" 
          icon={<Info size={24} />}
          description="1. Importe seu arquivo CSV. 2. Confira os números listados. 3. Baixe o CSV organizado." 
        />
        <InfoCard 
          title="Dicas de Formato" 
          icon={<CheckCircle size={24} />}
          description="O CSV deve conter apenas números, separados por vírgula ou linha. Espaços extras serão removidos automaticamente." 
        />
        <InfoCard 
          title="Total Números" 
          icon={<UserPlus size={24} />}
          description={`${contacts.length} números importados.`} 
        />
        <InfoCard 
          title="Números Únicos" 
          icon={<UserPlus size={24} />}
          description={`${uniqueCount} números únicos encontrados.`} 
        />
      </div>

      {/* IMPORTAÇÃO CSV */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText size={20} /> Importar Contatos CSV
        </h2>
        <p className="text-gray-400 text-sm">
          Envie um arquivo CSV contendo números de telefone. Eles serão organizados para download, um número por linha.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="w-full text-white file:bg-[#141414] file:border file:border-[#2a2a2a] file:rounded-xl file:px-4 file:py-2 file:cursor-pointer mt-2"
        />

        {error && <p className="text-red-500">{error}</p>}

        {fileReady && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-60 overflow-y-auto">
              {contacts.map((c, i) => (
                <div key={i} className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-2 text-sm truncate">
                  {c.numero}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4 text-gray-300 text-sm">
              <span>Total números importados: {contacts.length}</span>
              <span>Números únicos: {uniqueCount}</span>
            </div>

            <button
              onClick={downloadCsv}
              className="btn-primary w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2 transition"
            >
              <Download size={16} /> Baixar CSV Organizado
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ----------------------------
// COMPONENTE CARD INFORMATIVO
function InfoCard({ title, icon, description }) {
  return (
    <div className="p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl text-center hover:scale-105 transition-transform duration-200">
      <div className="flex justify-center mb-2 text-blue-500">{icon}</div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-gray-400 text-xs mt-1">{description}</p>
    </div>
  );
}
