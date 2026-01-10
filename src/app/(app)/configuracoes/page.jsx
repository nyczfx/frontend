"use client";

import { useState, useRef, useEffect } from "react";

export default function Configuracoes() {
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tag, setTag] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("user_avatar");
    const savedName = localStorage.getItem("user_name");
    const savedEmail = localStorage.getItem("user_email");
    const savedPhone = localStorage.getItem("user_phone");
    const savedTag = localStorage.getItem("user_tag");

    if (savedAvatar) setImagePreview(savedAvatar);
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPhone) setPhone(savedPhone);
    if (savedTag) setTag(savedTag);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setImagePreview(base64);
      localStorage.setItem("user_avatar", base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user_name", name);
    localStorage.setItem("user_email", email);
    localStorage.setItem("user_phone", phone);
    localStorage.setItem("user_tag", tag);
    alert("Configurações salvas!");
  };

  return (
    <div className="p-10 text-white space-y-10">
      <h1 className="text-3xl font-semibold">Configurações</h1>
      <p className="text-gray-400">Gerencie suas informações e perfil dentro do Studdy</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* CARD DE PERFIL */}
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-xl flex flex-col items-center gap-6">
          <div
            className="w-32 h-32 rounded-full bg-neutral-700 flex items-center justify-center overflow-hidden ring-1 ring-neutral-600 cursor-pointer hover:ring-neutral-400 transition-all"
            onClick={() => fileInputRef.current.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-neutral-300 text-sm">Foto</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImage}
            className="hidden"
          />

          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#0c0c0c] border border-neutral-700 text-white focus:ring-2 focus:ring-neutral-500 outline-none"
          />
        </div>

        {/* CARD DE INFORMAÇÕES */}
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-xl flex flex-col gap-6">
          <h2 className="text-xl font-semibold mb-2">Informações do Usuário</h2>
          
          <div className="flex flex-col gap-4">
            <label className="text-gray-400 text-sm">E-mail</label>
            <input
              type="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0c0c0c] border border-neutral-700 text-white focus:ring-2 focus:ring-neutral-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-gray-400 text-sm">Telefone</label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0c0c0c] border border-neutral-700 text-white focus:ring-2 focus:ring-neutral-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="text-gray-400 text-sm">Tag / Observação</label>
            <input
              type="text"
              placeholder="Ex: Admin, User..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#0c0c0c] border border-neutral-700 text-white focus:ring-2 focus:ring-neutral-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-white text-black font-semibold hover:bg-neutral-200 transition-all"
          >
            Salvar Configurações
          </button>
        </div>
      </form>

      {/* CARDS DE DICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
          <h4 className="font-medium mb-2">Dica 1</h4>
          <p className="text-sm text-gray-400">
            Mantenha seu avatar atualizado para fácil identificação na dashboard.
          </p>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
          <h4 className="font-medium mb-2">Dica 2</h4>
          <p className="text-sm text-gray-400">
            Preencha corretamente seu e-mail e telefone para receber notificações.
          </p>
        </div>
        <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
          <h4 className="font-medium mb-2">Dica 3</h4>
          <p className="text-sm text-gray-400">
            Utilize tags para organizar usuários e permissões na sua equipe.
          </p>
        </div>
      </div>
    </div>
  );
}
