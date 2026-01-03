"use client";
import React, { useEffect, useState } from "react";

export default function MensagensPage() {
  const [contacts, setContacts] = useState([]);

  // ADICIONAR CONTATO
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // MENSAGEM + IMAGEM
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // CONTATOS SELECIONADOS
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // =======================
  // LOAD CONTACTS
  // =======================
  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then((res) => res.json())
      .then((data) => setContacts(data || []))
      .catch(() => setContacts([]));
  }, []);

  // =======================
  // SAVE CONTACT
  // =======================
  const saveContact = () => {
    if (!newName.trim() || !newNumber.trim())
      return alert("Preencha nome e número!");

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
        if (data.ok) {
          setContacts([...contacts, data.contato]);
        }
        setNewName("");
        setNewNumber("");
        setNewTag("");
        setNewNotes("");
      });
  };

  // =======================
  // UPLOAD IMAGE
  // =======================
  const handleImageUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImage(f);
      setImagePreview(URL.createObjectURL(f));
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

  // =======================
  // SEND MESSAGE (REAL)
  // =======================
  const sendMessage = async () => {
    if (!message.trim()) return alert("Digite uma mensagem!");
    if (selectedContacts.length === 0)
      return alert("Selecione contatos!");

    for (let number of selectedContacts) {
      const formData = new FormData();
      formData.append("number", number);
      formData.append("message", message);

      if (image) formData.append("image", image);

      try {
        await fetch("http://localhost:3001/wa/send-message", {
          method: "POST",
          body: formData,
        });
      } catch (err) {
        console.error("Erro ao enviar:", err);
      }
    }

    alert("Mensagem enviada!");
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-bold mb-2 tracking-tight">Mensagens</h1>

      <p className="text-neutral-400 mb-10 text-sm">
        Envie mensagens instantaneamente para seus contatos no WhatsApp.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* COLUNA ESQUERDA */}
        <div className="flex flex-col gap-10">

          {/* CARD ADD CONTATO */}
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
              ></textarea>

              <button
                onClick={saveContact}
                className="bg-white text-black px-4 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
              >
                Salvar Contato
              </button>
            </div>
          </div>

          {/* CARD MENSAGEM + IMAGEM */}
          <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">

            <h2 className="text-lg font-semibold mb-4">Mensagem</h2>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem..."
              className="w-full bg-black border border-neutral-700 rounded-xl px-3 py-3 h-32 mb-4"
            />

            <label className="cursor-pointer bg-neutral-900 px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition inline-block">
              Upload de Imagem
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {imagePreview && (
              <img
                src={imagePreview}
                className="w-full mt-4 rounded-xl border border-neutral-800"
              />
            )}

          </div>
        </div>

        {/* COLUNA DIREITA */}
        <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-xl shadow-black/30">

          <h2 className="text-lg font-semibold mb-4">Contatos Salvos</h2>

          <label className="flex items-center gap-2 mb-4 cursor-pointer">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            Selecionar Todos
          </label>

          <div className="space-y-3 mb-8">
            {contacts.map((c, index) => (
              <div
                key={index}
                className="bg-black border border-neutral-700 rounded-xl p-4 flex justify-between items-center hover:border-neutral-500 transition"
              >
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-neutral-400 text-sm">{c.number}</p>

                  {c.tag && (
                    <p className="text-xs text-neutral-500 mt-1">Tag: {c.tag}</p>
                  )}

                  {c.notes && (
                    <p className="text-xs text-neutral-600 mt-1">{c.notes}</p>
                  )}
                </div>

                <input
                  type="checkbox"
                  checked={selectedContacts.includes(c.number)}
                  onChange={() => toggleSelectContact(c.number)}
                />
              </div>
            ))}
          </div>

          <button
            onClick={sendMessage}
            className="w-full bg-white text-black px-5 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition"
          >
            Enviar Mensagem
          </button>

        </div>
      </div>
    </div>
  );
}
