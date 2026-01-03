"use client";

export default function Inicio() {
  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-semibold mb-8">Bem-vindo ao Studdy</h1>

      {/* PRIMEIRA LINHA DE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-2">Status do Sistema</h2>
          <p className="text-sm text-gray-400">Todos os serviços estão ativos.</p>
          <p className="text-green-400 font-semibold mt-2">● Online</p>
        </div>

        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-2">Mensagens Recentes</h2>
          <p className="text-sm text-gray-400">Veja como seus usuários estão interagindo.</p>
          <button className="mt-3 bg-white text-black py-2 px-4 rounded-xl hover:bg-gray-200 transition">
            Ver mensagens
          </button>
        </div>

        <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-2">Novidades</h2>
          <p className="text-sm text-gray-400">Atualização 1.2: gravação rápida, melhorias de UI e novos gráficos.</p>
        </div>

      </div>

      {/* SEGUNDO BLOCO */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-8 shadow-lg mb-8">
        <h2 className="text-xl font-medium mb-4">O que você pode fazer no Studdy?</h2>

        <ul className="space-y-3 text-gray-300">
          <li>✔ Enviar mensagens e áudios para seus contatos rapidamente</li>
          <li>✔ Acompanhar estatísticas completas na Dashboard</li>
          <li>✔ Gerenciar contatos com facilidade</li>
          <li>✔ Personalizar foto e dados do perfil</li>
        </ul>
      </div>

      {/* ÚLTIMO BLOCO */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-8 shadow-lg">
        <h2 className="text-xl font-medium mb-4">Dicas rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#141414] border border-[#2a2a2a] p-5 rounded-xl">
            <h3 className="font-semibold mb-2">Organize</h3>
            <p className="text-gray-400 text-sm">Mantenha seus contatos atualizados para facilitar seu fluxo diário.</p>
          </div>

          <div className="bg-[#141414] border border-[#2a2a2a] p-5 rounded-xl">
            <h3 className="font-semibold mb-2">Analise</h3>
            <p className="text-gray-400 text-sm">Use a dashboard para entender seu desempenho semanal.</p>
          </div>

          <div className="bg-[#141414] border border-[#2a2a2a] p-5 rounded-xl">
            <h3 className="font-semibold mb-2">Gerencie</h3>
            <p className="text-gray-400 text-sm">Personalize seu perfil e mantenha sua conta segura.</p>
          </div>

        </div>
      </div>

    </div>
  );
}
