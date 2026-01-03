"use client";
import React, { useEffect, useState } from "react";

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

  // Load contacts
  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data || []))
      .catch(() => setContacts([]));
  }, []);

  // Upload audio
  const handleAudioUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setAudioFile(f);
      setAudioPreview(URL.createObjectURL(f));
    }
  };

  // Save contact
  const saveContact = () => {
    if (!newName.trim() || !newNumber.trim())
      return alert("Preencha os campos!");

    const payload = {
      name: newName,
      number: newNumber,
      tag: newTag,
      notes: newNotes,
    };

    fetch("http://localhost:3001/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.contato) {
          setContacts([...contacts, data.contato]);
        }
        setNewName("");
        setNewNumber("");
        setNewTag("");
        setNewNotes("");
      });
  };

  // DELETE CONTACT (FINAL)
  const deleteContact = async (number) => {
    if (!confirm("Deseja realmente remover este contato?")) return;

    try {
      const res = await fetch("http://localhost:3001/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number }),
      });

      const data = await res.json();

      if (data.ok) {
        setContacts(contacts.filter((c) => c.number !== number));
        setSelectedContacts(selectedContacts.filter((n) => n !== number));
      }
    } catch (err) {
      console.error("Erro ao excluir contato:", err);
    }
  };

  const toggleSelectAll = () => {
    if (!selectAll) {
      setSelectedContacts(contacts.map((c) => c.number));
    } else {
      setSelectedContacts([]);
    }
    setSelectAll(!selectAll);
  };

  const toggleSelectContact = (num) => {
    if (selectedContacts.includes(num)) {
      setSelectedContacts(selectedContacts.filter((n) => n !== num));
    } else {
      setSelectedContacts([...selectedContacts, num]);
    }
  };

  // SEND AUDIO
  const sendAudio = async () => {
    if (!audioFile) return alert("Selecione um áudio!");
    if (selectedContacts.length === 0)
      return alert("Selecione pelo menos um contato!");

    for (let number of selectedContacts) {
      const formData = new FormData();
      formData.append("number", number);
      formData.append("audio", audioFile);

      try {
        const res = await fetch("http://localhost:3001/wa/send-audio", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!data.ok) {
          console.error("❌ Erro no envio:", data.error);
        } else {
          console.log("✔ Enviado para", number);
        }
      } catch (err) {
        console.error("❌ Falha no envio:", err);
      }
    }

    alert("Áudio enviado!");
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Áudios</h1>

      <p className="text-neutral-400 mb-10 text-sm">
        Envie áudios instantaneamente para seus contatos no WhatsApp.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex flex-col gap-8">

          <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <h2 className="text-lg font-semibold mb-4">Upload de Áudio</h2>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition">
                Escolher arquivo
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
              </label>

              <button className="bg-white text-black px-4 py-2 rounded-xl hover:bg-neutral-200">
                Upload
              </button>
            </div>

            {audioPreview && (
              <audio controls className="w-full mt-4 rounded-xl">
                <source src={audioPreview} />
              </audio>
            )}
          </div>

          <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">
            <h2 className="text-lg font-semibold mb-4">Adicionar Contato</h2>

            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome..."
                  className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2"
                />
                <input
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  placeholder="Número..."
                  className="flex-1 bg-black border border-neutral-700 rounded-xl px-3 py-2"
                />
              </div>

              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Tag / Categoria"
                className="bg-black border border-neutral-700 rounded-xl px-3 py-2"
              />

              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Observações (opcional)"
                className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-3 h-24"
              />

              <button
                onClick={saveContact}
                className="bg-white text-black px-4 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
              >
                Salvar Contato
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30 h-fit">
          <h2 className="text-lg font-semibold mb-4">Contatos Salvos</h2>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={toggleSelectAll}
            />
            Selecionar Todos
          </label>

          <div className="space-y-3 mb-8">
            {contacts.map((c, i) => (
              <div
                key={i}
                className="bg-black border border-neutral-700 rounded-xl p-4 flex justify-between items-center hover:border-neutral-500 transition"
              >
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-neutral-400 text-sm">{c.number}</p>

                  {c.tag && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Tag: {c.tag}
                    </p>
                  )}

                  {c.notes && (
                    <p className="text-xs text-neutral-600 mt-1">
                      {c.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c.number)}
                    onChange={() => toggleSelectContact(c.number)}
                  />

                  <button
                    onClick={() => deleteContact(c.number)}
                    className="bg-white text-black rounded-md px-2 py-[1px] text-xs font-bold hover:bg-neutral-300 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={sendAudio}
            className="w-full bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
          >
            Enviar Áudio
          </button>
        </div>
      </div>
    </div>
  );
}
