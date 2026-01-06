"use client";
import React, { useEffect, useState, useRef } from "react";
import { Upload, Trash2, User, Send, X, FileAudio, Play, Pause } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AudiosPage() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [playing, setPlaying] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [chartData, setChartData] = useState([]);

  const audioRef = useRef(null);
  const API = "http://localhost:3000/api/dashboard";

  /* ===== CONTATOS ===== */
  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then(res => res.json())
      .then(setContacts)
      .catch(() => setContacts([]));
  }, []);

  /* ===== GRÁFICO DE ÁUDIOS ===== */
  useEffect(() => {
    const loadChart = async () => {
      try {
        const res = await fetch(`${API}/audios`);
        const data = await res.json();
        setChartData(data);
      } catch {
        setChartData([]);
      }
    };

    loadChart();
    const interval = setInterval(loadChart, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ===== ÁUDIO ===== */
  const handleAudioUpload = e => {
    const f = e.target.files[0];
    if (f) {
      if (audioPreview) URL.revokeObjectURL(audioPreview);
      setAudioFile(f);
      setAudioPreview(URL.createObjectURL(f));
      setPlaying(false);
    }
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
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioFile(null);
    setAudioPreview(null);
    setPlaying(false);
  };

  /* ===== CONTATOS ===== */
  const saveContact = () => {
    if (!newName || !newNumber) return alert("Preencha nome e número");

    fetch("http://localhost:3001/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        number: newNumber,
        tag: newTag,
        notes: newNotes,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data) setContacts([...contacts, data]);
        setNewName("");
        setNewNumber("");
        setNewTag("");
        setNewNotes("");
      });
  };

  const deleteContact = async number => {
    if (!confirm("Remover contato?")) return;

    await fetch(`http://localhost:3001/contacts/${number}`, {
      method: "DELETE",
    });

    setContacts(contacts.filter(c => c.number !== number));
    setSelectedContacts(selectedContacts.filter(n => n !== number));
  };

  const toggleSelectAll = () => {
    setSelectedContacts(selectAll ? [] : contacts.map(c => c.number));
    setSelectAll(!selectAll);
  };

  const toggleSelectContact = num => {
    setSelectedContacts(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  /* ===== ENVIO ===== */
  const sendAudio = async () => {
    if (!audioFile || selectedContacts.length === 0)
      return alert("Selecione áudio e contatos");

    for (let number of selectedContacts) {
      const fd = new FormData();
      fd.append("number", number);
      fd.append("audio", audioFile);

      await fetch("http://localhost:3001/wa/send-audio", {
        method: "POST",
        body: fd,
      });
    }

    alert("Áudio enviado!");
  };

  return (
    <div className="p-8 text-white space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Áudios</h1>
        <p className="text-gray-400">
          Envie áudios naturais para seus contatos no WhatsApp
        </p>
      </div>

      {/* DASHBOARD */}
      <div className="space-y-8">

        {/* GRÁFICO */}
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-lg font-medium mb-4">
            Envios dos Últimos 30 Dias
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="#555" />
                <YAxis stroke="#555" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="audios"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Áudios Naturais"
            text="Use áudios curtos e com pausas naturais para evitar bloqueios."
          />
          <InfoCard
            title="Intervalo Seguro"
            text="Recomendado aguardar entre 8–15 segundos entre envios."
          />
          <InfoCard
            title="Formato Ideal"
            text="Opus ou OGG oferecem melhor entrega no WhatsApp."
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="space-y-8">

          {/* UPLOAD DE ÁUDIO COM PLAYER */}
          <Card title="Upload de Áudio">
            {!audioFile && (
              <label className="flex flex-col items-center justify-center w-full h-40 bg-[#141414] border border-[#2a2a2a] border-dashed rounded-xl cursor-pointer hover:border-white/20 transition">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-gray-400">Clique para selecionar um áudio</span>
                <span className="text-xs text-gray-500 mt-1">MP3, WAV, OGG, OPUS</span>
                <input type="file" accept="audio/*" hidden onChange={handleAudioUpload} />
              </label>
            )}

            {audioFile && audioPreview && (
              <div className="relative mt-4 bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-4">
                {/* BOTÃO REMOVER */}
                <button
                  onClick={removeAudio}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  title="Remover áudio"
                >
                  <X size={14} />
                </button>

                {/* PLAY */}
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition"
                >
                  {playing ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* INFO */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{audioFile.name}</p>
                  <p className="text-xs text-gray-400">Pré-visualização do áudio</p>
                </div>

                <FileAudio size={20} className="text-gray-500" />

                <audio
                  ref={audioRef}
                  src={audioPreview}
                  onEnded={() => setPlaying(false)}
                />
              </div>
            )}
          </Card>

          {/* ADICIONAR CONTATO */}
          <Card title="Adicionar Contato">
            <div className="flex flex-col gap-4">
              <input className="input" placeholder="Nome" value={newName} onChange={e => setNewName(e.target.value)} />
              <input className="input" placeholder="Número" value={newNumber} onChange={e => setNewNumber(e.target.value)} />
              <input className="input" placeholder="Tag" value={newTag} onChange={e => setNewTag(e.target.value)} />
              <textarea className="textarea h-24" placeholder="Observações" value={newNotes} onChange={e => setNewNotes(e.target.value)} />
              <button onClick={saveContact} className="btn-primary w-fit">Salvar Contato</button>
            </div>
          </Card>
        </div>

        {/* CONTATOS SALVOS */}
        <Card title="Contatos Salvos">
          <label className="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            Selecionar todos
          </label>

          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {contacts.map((c, i) => (
              <div key={i} className="contact-item flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <User size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c.number)}
                    onChange={() => toggleSelectContact(c.number)}
                  />
                  <button onClick={() => deleteContact(c.number)} className="icon-btn">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={sendAudio} className="btn-primary w-full mt-6">
            <Send size={16} /> Enviar Áudio
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ===== COMPONENTES ===== */

function Card({ title, children }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      {children}
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
