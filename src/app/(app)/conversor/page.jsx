'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileAudio,
  Play,
  Pause,
  ShieldCheck,
  Zap,
  X,
} from 'lucide-react';

export default function ConversorPage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [playing, setPlaying] = useState(false);

  const audioRef = useRef(null);
  const API = 'https://studdy-8yb8.onrender.com';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setDownloadUrl(null);
    setPlaying(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) audioRef.current.pause();
    else audioRef.current.play();

    setPlaying(!playing);
  };

  const removeAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    setFile(null);
    setPreviewUrl(null);
    setDownloadUrl(null);
    setPlaying(false);
  };

  const handleConvert = async () => {
    if (!file) return alert('Selecione um áudio primeiro');

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API}/converter`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro na conversão');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Erro ao converter o áudio');
    }

    setLoading(false);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [previewUrl, downloadUrl]);

  return (
    <div className="w-full px-10 py-8 text-white">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Conversor de Áudio</h1>
        <p className="text-neutral-400 mt-2">
          Converta seus áudios para <strong>.opus</strong> com qualidade profissional.
        </p>
      </div>

      {/* CARD PRINCIPAL */}
      <div className="bg-[#0c0c0c] border border-neutral-900 rounded-2xl p-8 shadow-xl max-w-3xl">
        {/* UPLOAD */}
        {!file && (
          <label className="flex flex-col items-center justify-center w-full h-40 bg-neutral-950 border border-dashed border-neutral-800 rounded-xl cursor-pointer hover:border-neutral-600 transition">
            <Upload size={32} className="text-neutral-400 mb-2" />
            <span className="text-neutral-400">
              Clique para selecionar um áudio
            </span>
            <span className="text-xs text-neutral-600 mt-1">
              MP3, WAV, M4A, OGG
            </span>
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* PLAYER */}
        {file && previewUrl && (
          <div className="relative mt-6 bg-neutral-950 border border-neutral-900 rounded-xl p-4 flex items-center gap-4">
            {/* BOTÃO REMOVER */}
            <button
              onClick={removeAudio}
              className="absolute top-3 right-3 text-neutral-500 hover:text-red-500 transition"
              title="Remover áudio"
            >
              <X size={16} />
            </button>

            {/* PLAY */}
            <button
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-neutral-200 transition"
            >
              {playing ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {/* INFO */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-neutral-400">
                Pré-visualização do áudio
              </p>
            </div>

            <FileAudio size={20} className="text-neutral-500" />

            <audio
              ref={audioRef}
              src={previewUrl}
              onEnded={() => setPlaying(false)}
            />
          </div>
        )}

        {/* BOTÃO CONVERTER */}
        {file && (
          <button
            onClick={handleConvert}
            disabled={loading}
            className={`mt-6 w-full py-3 rounded-xl font-medium transition ${
              loading
                ? 'bg-neutral-700 cursor-not-allowed'
                : 'bg-white text-black hover:bg-neutral-200'
            }`}
          >
            {loading ? 'Convertendo...' : 'Converter para .opus'}
          </button>
        )}

        {/* DOWNLOAD */}
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={file.name.replace(/\.[^/.]+$/, '.opus')}
            className="block mt-4 w-full text-center bg-green-600 py-3 rounded-xl hover:bg-green-700 transition"
          >
            Baixar áudio convertido
          </a>
        )}
      </div>

      {/* BENEFÍCIOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl">
        <InfoCard
          icon={<Zap />}
          title="Alta eficiência"
          text="OPUS mantém qualidade com arquivos muito menores."
        />
        <InfoCard
          icon={<ShieldCheck />}
          title="Privacidade"
          text="Arquivos não ficam armazenados no servidor."
        />
        <InfoCard
          icon={<FileAudio />}
          title="Pronto para automações"
          text="Ideal para automações."
        />
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-[#0c0c0c] border border-neutral-900 rounded-xl p-6">
      <div className="text-neutral-300 mb-3">{icon}</div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-neutral-400">{text}</p>
    </div>
  );
}
