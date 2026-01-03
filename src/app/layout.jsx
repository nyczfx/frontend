import "./globals.css";

export const metadata = {
  title: "Study",
  description: "Painel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
