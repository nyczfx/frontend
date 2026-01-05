'use client';

import { useState } from "react";
import { Upload } from "lucide-react";

export default function Converter() {
  const [audio, setAudio] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ffmpegModule, setFFmpegModule] = useState(null);

  const handleFile = (e) => {
    setAudio(e.target.files[0]);
    setOutput(null);
  };

  const handleConvert = async () => {
    if (!audio) return alert("Selecione um áudio primeiro");

    setLoading(true);

    try {
      // IMPORTAÇÃO DINÂMICA do FFmpeg apenas no cliente
      let ffmpegInstance, fetchFile;
      if (!ffmpegModule) {
        const ffmpeg = await import("@ffmpeg/ffmpeg");
        ffmpegInstance = ffmpeg.createFFmpeg({ log: true });
        fetchFile = ffmpeg.fetchFile;
        setFFmpegModule({ ffmpegInstance, fetchFile });
      } else {
        ffmpegInstance = ffmpegModule.ffmpegInstance;
        fetchFile = ffmpegModule.fetchFile;
      }

      if (!ffmpegInstance.isLoaded()) await ffmpegInstance.load();

      ffmpegInstance.FS("writeFile", audio.name, await fetchFile(audio));

      const outputName = audio.name.split(".")[0] + ".opus";
      await ffmpegInstance.run("-i", audio.name, "-c:a", "libopus", outputName);

      const data = ffmpegInstance.FS("readFile", outputName);
      const url = URL.createObjectURL(new Blob([data.buffer], { type: "audio/ogg" }));
      setOutput(url);

    } catch (err) {
      console.error(err);
      alert("Erro ao converter o áudio");
    }

    setLoading(false);
  };

  return (
    <div className="w-full px-10 py-6 text-white">
      <h1 className="text-3xl font-semibold mb-6">Conversor de Áudio</h1>

      <div className="bg-[#0c0c0c] border border-neutral-900 rounded-2xl p-6 shadow-lg space-y-4">
        <label className="flex flex-col items-center justify-center w-full h-36 bg-neutral-950 border border-neutral-900 rounded-xl cursor-pointer hover:border-neutral-700 transition">
          <Upload size={28} className="text-neutral-400 mb-2" />
          <span className="text-neutral-400 hover:text-white transition">
            Selecionar áudio
          </span>
          <input type="file" accept="audio/*" className="hidden" onChange={handleFile} />
        </label>

        {audio && (
          <p className="text-gray-300 text-sm">
            Arquivo selecionado: <span className="font-medium">{audio.name}</span>
          </p>
        )}

        <button
          onClick={handleConvert}
          disabled={loading}
          className={`mt-2 w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-neutral-200 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Convertendo..." : "Converter para .opus"}
        </button>

        {output && (
          <a
            href={output}
            download={audio.name.split(".")[0] + ".opus"}
            className="block mt-4 w-full text-center bg-green-600 py-3 rounded-xl hover:bg-green-700 transition"
          >
            Baixar Áudio Convertido
          </a>
        )}
      </div>
    </div>
  );
}
