import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import MetalButton from '@/components/ui/metal-button';
import { WHATSAPP_RPA } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/**
 * Slot A do vídeo — loop de fundo da hero (5s, sem som, emenda por crossfade).
 * Footage: VEO (Google Flow), take 22/jul — rede blueprint azul→dourada
 * radial com centro escuro (legibilidade do título). Marca d'água removida
 * via delogo; loop montado com xfade do fim sobre o começo (sem "reset").
 */
const HERO_LOOP_SRC: string | null = '/rpa/hero-loop.mp4';
const HERO_LOOP_POSTER: string | null = '/rpa/hero-poster.webp';

interface RpaHeroProps {
  /** false enquanto o splash roda — o conteúdo monta quando vira true. */
  textReady?: boolean;
}

export default function RpaHero({ textReady = true }: RpaHeroProps) {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="top" className="relative min-h-svh w-full overflow-hidden bg-ink">
      {/* Fundo: vídeo em loop (quando existir) ou textura estática da marca */}
      {HERO_LOOP_SRC && !reduceMotion ? (
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          src={HERO_LOOP_SRC}
          poster={HERO_LOOP_POSTER ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : HERO_LOOP_POSTER ? (
        /* Sem motion (preferência do usuário): frame estático do mesmo footage */
        <img
          src={HERO_LOOP_POSTER}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
      ) : (
        <img
          src="/cascata.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-[0.14]"
        />
      )}

      {/* Escurecimento p/ legibilidade + glows da marca */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ink/85 via-ink/40 to-ink" />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(48% 38% at 50% 42%, rgba(71,138,201,0.22) 0%, rgba(71,138,201,0) 70%)' }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(30% 24% at 72% 30%, rgba(255,196,0,0.10) 0%, rgba(255,196,0,0) 70%)' }}
      />

      {/* Conteúdo — monta quando o splash sai */}
      <div className="relative z-10 flex min-h-[calc(100svh-69px)] flex-col">
        {textReady && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            {/* Eyebrow editorial — mesmo padrão da home */}
            <AnimatedContainer delay={0.1} className="mb-8 flex flex-col items-center gap-2.5">
              <span className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-white/30 sm:w-12" />
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                  Automação de Processos — RPA
                </span>
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-white/30 sm:w-12" />
              </span>
            </AnimatedContainer>

            <h1 className="font-display font-extrabold leading-[1.05] tracking-tight">
              <TextStagger
                text="Sua equipe pensa."
                className="mb-1 block font-light italic leading-[1.3] text-white/90 text-4xl sm:text-5xl md:text-6xl"
              />
              <span className="flex items-baseline justify-center leading-[1.18] text-5xl sm:text-6xl md:text-7xl">
                <TextStagger
                  text="Os robôs repetem"
                  delay={0.55}
                  highlight={['robôs']}
                  highlightClassName="hero-kw"
                  className="block"
                />
                <AnimatedContainer delay={1.0} className="text-brand-yellow">.</AnimatedContainer>
              </span>
            </h1>

            <AnimatedContainer delay={1.15} className="mt-7 max-w-2xl">
              <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
                Robôs de software assumem o trabalho repetitivo da sua operação —
                testados e blindados como todo software TACONTUDO.
              </p>
            </AnimatedContainer>

            {/* Linha de prova — números com fonte, sem promessa vazia */}
            <AnimatedContainer
              delay={1.35}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-display text-xs text-white/45 sm:text-sm"
            >
              <span>
                payback típico <span className="font-semibold text-brand-yellow">&lt; 12 meses</span>
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
              <span>
                <span className="font-semibold text-brand-yellow">92%</span> reportam mais compliance
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
              <span>
                testando software desde <span className="font-semibold text-brand-yellow">2020</span>
              </span>
            </AnimatedContainer>

            <AnimatedContainer delay={1.55} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <MetalButton>
                <a
                  href={WHATSAPP_RPA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Automatizar um processo
                </a>
              </MetalButton>
              <a
                href="#processo"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-display font-semibold text-white transition-colors hover:bg-white/10"
              >
                Ver como fazemos
                <ArrowRight className="h-4 w-4" />
              </a>
            </AnimatedContainer>
          </div>
        )}
      </div>
    </section>
  );
}
