export default function AuthLayout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
