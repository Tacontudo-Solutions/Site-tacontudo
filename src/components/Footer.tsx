import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';
import { INSTAGRAM, TAGLINE } from '@/lib/site';

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    // lottie-web é pesado (~280 kB min) e só anima o ícone do Instagram no
    // rodapé — import dinâmico tira ele do bundle inicial; carrega depois.
    let cancelado = false;

    import('lottie-web').then(({ default: lottie }) => {
      if (cancelado || !containerRef.current) return;
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: '/instagram.json',
      });
    });

    return () => {
      cancelado = true;
      if (animRef.current) animRef.current.destroy();
    };
  }, []);

  const handleMouseEnter = () => {
    if (animRef.current) {
      animRef.current.setDirection(1);
      animRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (animRef.current) {
      animRef.current.setDirection(-1);
      animRef.current.play();
    }
  };

  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
        <img
          src="/logo.webp"
          alt="TACONTUDO IT Solutions"
          className="h-20 w-auto"
        />
        <p className="font-display text-sm italic text-white/50">{TAGLINE}</p>
        <p className="font-display text-[11px] uppercase tracking-[0.25em] text-white/35">
          Desde 2020
        </p>

        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram da TACONTUDO"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-brand-yellow hover:text-brand-yellow instagram-btn"
        >
          <div ref={containerRef} className="h-5 w-5 lottie-instagram-container" />
        </a>

        <nav aria-label="Páginas legais" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a
            href="/politica-de-privacidade/"
            className="font-display text-xs font-medium text-white/55 transition-colors hover:text-brand-yellow"
          >
            Política de Privacidade
          </a>
          <a
            href="/politica-de-cookies/"
            className="font-display text-xs font-medium text-white/55 transition-colors hover:text-brand-yellow"
          >
            Política de Cookies
          </a>
        </nav>

        <p className="text-xs text-white/35">
          © 2020–{new Date().getFullYear()} TACONTUDO IT Solutions · Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
}
