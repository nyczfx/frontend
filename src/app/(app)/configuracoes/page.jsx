"use client";

import { useState, useRef, useEffect } from "react";

export default function Configuracoes() {
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedAvatar = localStorage.getItem("user_avatar");
    const savedName = localStorage.getItem("user_name");

    if (savedAvatar) setImagePreview(savedAvatar);
    if (savedName) setName(savedName);
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Converte para BASE64
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
    alert("Configurações salvas!");
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-semibold mb-12">Configurações</h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#111]
          border border-neutral-800 
          rounded-2xl 
          p-12 
          max-w-3xl 
          shadow-xl
          mx-auto
          flex 
          flex-col 
          gap-10
        "
      >
        {/* FOTO */}
        <div>
          <label className="block text-xl font-medium mb-4">
            Foto de Perfil
          </label>

          <div className="flex items-center gap-8">
            <div
              className="
                w-32 h-32 
                rounded-full 
                bg-neutral-700 
                flex items-center justify-center 
                overflow-hidden 
                ring-1 ring-neutral-600 
                cursor-pointer 
                hover:ring-neutral-400 
                transition-all
              "
              onClick={() => fileInputRef.current.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
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
          </div>
        </div>

        {/* NOME */}
        <div>
          <label className="block text-xl font-medium mb-3">Nome</label>
          <input
            type="text"
            placeholder="Seu nome..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full 
              p-4 
              rounded-xl 
              bg-[#0c0c0c] 
              border border-neutral-700 
              text-white 
              text-lg
              focus:ring-2 focus:ring-neutral-500 
              outline-none
            "
          />
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          className="
            w-full 
            p-4 
            rounded-xl 
            bg-white 
            text-black 
            font-semibold 
            text-lg 
            hover:bg-neutral-200 
            transition-all
          "
        >
          Salvar
        </button>
      </form>
    </div>
  );
}
