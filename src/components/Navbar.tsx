import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV, WHATSAPP } from '@/lib/site';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-md">
      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <a href="/#top" aria-label="TACONTUDO — início" className="flex shrink-0 items-center" onClick={closeMenu}>
            <img
              src="/logo-amarelo.svg"
              alt="TACONTUDO IT Solutions"
              className="h-10 w-auto sm:h-14"
            />
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="font-display text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow md:hidden"
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir orçamento pelo WhatsApp"
              className="inline-flex whitespace-nowrap rounded-full bg-brand-yellow px-3 py-2 font-display text-xs font-semibold text-ink transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:px-5 sm:text-sm"
            >
              <span className="sm:hidden">Orçamento</span>
              <span className="hidden sm:inline">Pedir Orçamento</span>
            </a>
          </div>
        </div>

        {isMenuOpen && (
          <div id="mobile-navigation" className="absolute left-0 right-0 top-full border-b border-white/10 bg-ink px-4 py-3 shadow-2xl md:hidden">
            <nav className="grid gap-1" aria-label="Navegação mobile">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-display text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-brand-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
