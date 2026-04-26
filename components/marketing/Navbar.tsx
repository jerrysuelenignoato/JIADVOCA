import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-brand text-[#0C447C]">
          JIADVOCA
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link>
          <Link href="#precos" className="hover:text-foreground transition-colors">Preços</Link>
          <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="px-4 py-2 rounded-lg bg-[#0C447C] text-white text-sm font-medium hover:bg-[#185FA5] transition-colors"
          >
            Testar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
