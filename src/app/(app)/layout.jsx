import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function AppLayout({ children }) {
  return (
    <div className="bg-black text-white">

      {/* SIDEBAR FIXA */}
      <div className="fixed left-0 top-0 h-full w-20 border-r border-neutral-900 bg-[#0d0d0d]">
        <Sidebar />
      </div>

      {/* CONTEÚDO DESLOCADO */}
      <div className="ml-20">

        {/* HEADER NORMAL */}
        <div className="bg-[#0d0d0d] border-b border-neutral-900">
          <Header />
        </div>

        {/* MAIN */}
        <main className="px-12 py-10">
          {children}
        </main>

      </div>
    </div>
  );
}
