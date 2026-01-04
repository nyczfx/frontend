"use client";

import { useState } from "react";
import { Upload } from "lucide-react";

export default function Converter() {
  const [audio, setAudio] = useState(null);

  const handleFile = (e) => {
    setAudio(e.target.files[0]);
  };

  return (
    <div className="w-full px-10 py-6 text-white">

      {/* TÍTULO */}
      <h1 className="text-3xl font-semibold mb-6">Conversor de Áudio</h1>

      {/* CARD DO CONVERSOR */}
      <div className="bg-[#0c0c0c] border border-neutral-900 rounded-2xl p-6 shadow-lg">

        {/* Área de Upload */}
        <label className="flex flex-col items-center justify-center w-full h-36 bg-neutral-950 border border-neutral-900 rounded-xl cursor-pointer hover:border-neutral-700 transition">
          <Upload size={28} className="text-neutral-400 mb-2" />
          <span className="text-neutral-400 hover:text-white transition">
            Selecionar áudio
          </span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleFile}
          />
        </label>

        {/* BOTÃO */}
        <button className="mt-4 w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-200 transition">
          Converter para .opus
        </button>

      </div>
    </div>
  );
}
