import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <span className="text-xl font-semibold tracking-brand text-[#0C447C]">JIADVOCA</span>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Conteúdo magnético para a advocacia previdenciária. Alcance seus clientes da melhor forma.
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Produto</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</Link></li>
              <li><Link href="#precos" className="hover:text-foreground transition-colors">Preços</Link></li>
              <li><Link href="/cadastro" className="hover:text-foreground transition-colors">Criar conta</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/termos" className="hover:text-foreground transition-colors">Termos de uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-foreground transition-colors">Política de privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} JIADVOCA. Todos os direitos reservados.</p>
          <p>Feito para advogados previdenciaristas brasileiros 🇧🇷</p>
        </div>
      </div>
    </footer>
  );
}
