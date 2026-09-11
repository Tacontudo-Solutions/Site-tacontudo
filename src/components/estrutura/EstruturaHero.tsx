import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { WHATSAPP } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

interface EstruturaHeroProps {
  /** false enquanto o splash de carregamento roda — o texto só monta quando
   *  vira true, disparando as animações de entrada na sequência certa. */
  textReady?: boolean;
}

export default function EstruturaHero({ textReady = true }: EstruturaHeroProps) {
  return (
    <section id="top" className="relative min-h-svh w-full overflow-hidden bg-ink">
      {/* Fundo estático; o movimento fica só na tipografia. Art direction:
          versão 9:16 dedicada no mobile (não corta a foto 16:9 do desktop) */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/heroequipe-mobile.webp" />
        <img
          src="/herodesktop.webp"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        />
      </picture>

      {/* Véu de legibilidade (topo/base) — mantém a transição pro resto da página */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-ink/60 via-transparent to-ink" />

      {/* Conteúdo — pointer-events liberado só nos CTAs pra não roubar o mouse do 3D */}
      <div className="pointer-events-none relative z-10 flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
        {textReady && (
        <>
        <h1 className="font-display font-extrabold leading-[1.05] tracking-tight">
          <TextStagger
            text="Estamos estruturados"
            /* leading folgado: a máscara de reveal cortava descendentes (g/p/ç) */
            className="mb-1 block font-light italic leading-[1.3] text-brand-yellow text-4xl sm:text-5xl md:text-6xl"
          />
          <TextStagger
            text="pra sustentar cada entrega."
            delay={0.55}
            className="block leading-[1.18] text-4xl text-white sm:text-6xl md:text-7xl"
          />
        </h1>

        <AnimatedContainer delay={1.15} className="mt-7 max-w-2xl">
          <p className="text-base leading-relaxed text-white/65 sm:text-lg">
            Qualidade e segurança não nascem só da tecnologia. Nascem de uma operação
            organizada — pessoas, governança e gestão financeira que dão previsibilidade
            ao que entregamos.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={1.4} className="pointer-events-auto mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#departamentos"
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink shadow-lg shadow-brand-yellow/20 transition-transform hover:scale-105"
          >
            Conheça os departamentos
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-display font-semibold text-white transition-colors hover:bg-white/10"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Falar no WhatsApp
          </a>
        </AnimatedContainer>
        </>
        )}
      </div>
    </section>
  );
}
