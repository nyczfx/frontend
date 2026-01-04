"use client";
import React, { useEffect, useState } from "react";
import { User, Image as ImageIcon, Send, Plus } from "lucide-react";

export default function MensagensPage() {
  const [contacts, setContacts] = useState([]);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/contacts")
      .then(res => res.json())
      .then(setContacts)
      .catch(() => setContacts([]));
  }, []);

  const saveContact = () => {
    if (!newName || !newNumber) return alert("Preencha nome e número!");

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
        setNewName(""); setNewNumber(""); setNewTag(""); setNewNotes("");
      });
  };

  const handleImageUpload = e => {
    const f = e.target.files[0];
    if (f) {
      setImage(f);
      setImagePreview(URL.createObjectURL(f));
    }
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

  const sendMessage = async () => {
    if (!message || selectedContacts.length === 0)
      return alert("Mensagem ou contatos inválidos");

    for (let number of selectedContacts) {
      const fd = new FormData();
      fd.append("number", number);
      fd.append("message", message);
      if (image) fd.append("image", image);

      await fetch("http://localhost:3001/wa/send-message", {
        method: "POST",
        body: fd,
      });
    }

    alert("Mensagem enviada!");
  };

  return (
    <div className="p-8 text-white space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Mensagens</h1>
        <p className="text-gray-400 mt-1">
          Envio em massa para seus contatos no WhatsApp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUNA ESQUERDA */}
        <div className="space-y-8">

          {/* ADD CONTATO */}
         <Card title="Adicionar Contato">
  <div className="flex flex-col gap-4">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        value={newName}
        onChange={e => setNewName(e.target.value)}
        placeholder="Nome"
        className="input"
      />
      <input
        value={newNumber}
        onChange={e => setNewNumber(e.target.value)}
        placeholder="Número"
        className="input"
      />
    </div>

    <input
      value={newTag}
      onChange={e => setNewTag(e.target.value)}
      placeholder="Tag"
      className="input"
    />

    <textarea
      value={newNotes}
      onChange={e => setNewNotes(e.target.value)}
      placeholder="Observações"
      className="textarea h-24"
    />

    <button onClick={saveContact} className="btn-primary w-fit">
      <Plus size={16} /> Salvar Contato
    </button>

  </div>
</Card>


          {/* MENSAGEM */}
          <Card title="Mensagem / Imagem">
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Digite sua mensagem..." className="textarea" />

            <div className="flex items-center justify-between mt-4">
              <label className="btn-secondary cursor-pointer">
                <ImageIcon size={16} /> Upload imagem
                <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
              </label>

              <span className="text-xs text-gray-500">{message.length} caracteres</span>
            </div>

            {imagePreview && (
              <img src={imagePreview} className="mt-4 rounded-xl border border-neutral-800" />
            )}
          </Card>
        </div>

        {/* COLUNA DIREITA */}
        <Card title="Contatos Salvos">
          <label className="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            Selecionar todos
          </label>

          {/* LISTA ROLÁVEL */}
          <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
            {contacts.map((c, i) => (
              <div key={i} className="contact-item">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.number}</p>
                  </div>
                </div>

                <input type="checkbox"
                  checked={selectedContacts.includes(c.number)}
                  onChange={() => toggleSelectContact(c.number)}
                />
              </div>
            ))}
          </div>

          <button onClick={sendMessage} className="btn-primary w-full mt-6">
            <Send size={16} /> Enviar Mensagem
          </button>
        </Card>

      </div>
    </div>
  );
}

/* COMPONENTES BASE */

function Card({ title, children }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      {children}
    </div>
  );
}
