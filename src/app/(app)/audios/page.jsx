"use client";
import React, { useEffect, useState } from "react";
import { Upload, Trash2, User, Send, X } from "lucide-react";

export default function AudiosPage() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);

  const [contacts, setContacts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then(res => res.json())
      .then(setContacts)
      .catch(() => setContacts([]));
  }, []);

  const handleAudioUpload = e => {
    const f = e.target.files[0];
    if (f) {
      setAudioFile(f);
      setAudioPreview(URL.createObjectURL(f));
    }
  };

  // ✅ REMOVE ÁUDIO
  const removeAudio = () => {
    if (audioPreview) URL.revokeObjectURL(audioPreview);
    setAudioFile(null);
    setAudioPreview(null);
  };

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
        if (data.ok) setContacts([...contacts, data.contato]);
        setNewName("");
        setNewNumber("");
        setNewTag("");
        setNewNotes("");
      });
  };

  const deleteContact = async number => {
    if (!confirm("Remover contato?")) return;

    await fetch("http://localhost:3001/contacts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number }),
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUNA ESQUERDA */}
        <div className="space-y-8">

          <Card title="Upload de Áudio">
            <label className="btn-secondary w-fit cursor-pointer">
              <Upload size={16} /> Selecionar áudio
              <input
                type="file"
                hidden
                accept="audio/*"
                onChange={handleAudioUpload}
              />
            </label>

            {audioPreview && (
              <div className="relative mt-4">
                <button
                  onClick={removeAudio}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  title="Remover áudio"
                >
                  <X size={14} />
                </button>

                <audio controls className="w-full">
                  <source src={audioPreview} />
                </audio>
              </div>
            )}
          </Card>

          <Card title="Adicionar Contato">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="input"
                  placeholder="Nome"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Número"
                  value={newNumber}
                  onChange={e => setNewNumber(e.target.value)}
                />
              </div>

              <input
                className="input"
                placeholder="Tag"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
              />
              <textarea
                className="textarea h-24"
                placeholder="Observações"
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
              />

              <button onClick={saveContact} className="btn-primary w-fit">
                Salvar Contato
              </button>
            </div>
          </Card>
        </div>

        {/* COLUNA DIREITA */}
        <Card title="Contatos Salvos">
          <label className="flex items-center gap-2 text-sm mb-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            Selecionar todos
          </label>

          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {contacts.map((c, i) => (
              <div key={i} className="contact-item">
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

                  <button
                    onClick={() => deleteContact(c.number)}
                    className="icon-btn"
                  >
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

/* COMPONENTE BASE */
function Card({ title, children }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      {children}
    </div>
  );
}
