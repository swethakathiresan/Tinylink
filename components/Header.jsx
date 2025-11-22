export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">TinyLink</h1>
        <nav className="flex gap-4">
          <a href="/" className="text-sm">Dashboard</a>
          <a href="/healthz" className="text-sm">Health</a>
        </nav>
      </div>
    </header>
  );
}
