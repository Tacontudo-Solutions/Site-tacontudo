import { lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { WHATSAPP, CLIENTS, CLIENT_LOGOS } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/** Ajuste óptico: C&A tem muito respiro interno e fica pequena na mesma altura. */
const LOGO_SCALE: Record<string, string> = {
  'C&A': 'scale-[1.4]',
  'GINGAPAY': 'scale-[1.3]',
  'SAIPOS': 'scale-[1.3]',
  'MadeiraMadeira': 'scale-[1.5]',
  'Monte Bravo': 'scale-[2]',
  'Banco Genial': 'scale-[2]',
  'CPF Seguros': 'scale-[2]',
  'CredSis': 'scale-[2]',
};

// Code-split: o Three.js carrega depois; o texto/logo pintam na hora.
const GLSLHills = lazy(() =>
  import('@/components/ui/glsl-hills').then((m) => ({ default: m.GLSLHills })),
);

interface HeroProps {
  /** false enquanto o splash de abertura roda — o conteúdo só monta quando
   *  vira true, disparando as animações de entrada na sequência certa. */
  textReady?: boolean;
}

export default function Hero({ textReady = true }: HeroProps) {
  return (
    <section id="top" className="relative min-h-svh w-full overflow-hidden bg-ink">
      {/* Fundo animado (WebGL) — lazy */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <GLSLHills baseColor="#478ac9" peakColor="#f1c50e" />
        </Suspense>
      </div>

      {/* Véu blueprint isométrico (mesma textura da /nossa-estrutura/) — quase
          invisível, dá camada por cima das colinas e amarra as duas páginas */}
      <img
        src="/cascata.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover opacity-[0.06]"
      />

      {/* Escurecimento p/ legibilidade */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-b from-ink/80 via-ink/25 to-ink" />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(60% 50% at 50% 40%, rgba(11,18,32,0) 0%, rgba(11,18,32,0.55) 100%)' }}
      />
      {/* Glow radial azul atrás do título — foco de luz no evento da tela */}
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: 'radial-gradient(48% 38% at 50% 40%, rgba(71,138,201,0.20) 0%, rgba(71,138,201,0) 70%)' }}
      />

      {/* Conteúdo — só monta quando o splash sai (textReady) */}
      <div className="relative z-10 flex min-h-[calc(100svh-69px)] flex-col">
        {textReady && (
        <>
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          {/* Eyebrow editorial em duas linhas (hierarquia pedida pelo cliente):
              fundação no topo, centralizada → o que fazemos → frasão (h1) */}
          <AnimatedContainer delay={0.1} className="mb-8 flex flex-col items-center gap-2.5">
            <span className="flex items-center gap-4">
              <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-white/30 sm:w-12" />
              <span className="font-display text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                Desde 2020
              </span>
              <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-white/30 sm:w-12" />
            </span>
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.28em] text-white/55 sm:text-xs">
              Desenvolvimento · Qualidade · Segurança
            </p>
          </AnimatedContainer>

          <h1 className="font-display font-extrabold leading-[1.05] tracking-tight">
            <TextStagger
              text="Com qualidade e segurança"
              /* leading folgado: a máscara de reveal (overflow-hidden por palavra)
                 cortava os descendentes q/g/ç no italic. Palavras-chave acesas
                 em amarelo respirando (.hero-kw) — assinatura da marca. */
              highlight={['qualidade', 'segurança']}
              highlightClassName="hero-kw"
              className="mb-1 block font-light italic leading-[1.3] text-white/90 text-4xl sm:text-5xl md:text-6xl"
            />
            <span className="flex items-baseline justify-center leading-[1.18] text-5xl sm:text-6xl md:text-7xl">
              <TextStagger text="não se brinca" delay={0.55} className="block" />
              {/* ponto final amarelo — fecha a frase com intenção */}
              <AnimatedContainer delay={1.0} className="text-brand-yellow">.</AnimatedContainer>
            </span>
          </h1>

          <AnimatedContainer delay={1.15} className="mt-7 max-w-2xl">
            <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
              Construímos, testamos e blindamos software para empresas que não podem errar.
            </p>
          </AnimatedContainer>

          {/* Linha de prova: números antes dos logos */}
          <AnimatedContainer
            delay={1.35}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-display text-xs text-white/45 sm:text-sm"
          >
            <span>
              <span className="font-semibold text-brand-yellow">20+</span> grandes marcas atendidas
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
            <span>
              <span className="font-semibold text-brand-yellow">7+</span> certificações entre as mais respeitadas da TI
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
            <span>
              <span className="font-semibold text-brand-yellow">3+</span> normas de compliance junto aos órgãos reguladores
            </span>
          </AnimatedContainer>

          <AnimatedContainer delay={1.55} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink shadow-lg shadow-brand-yellow/20 transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar no WhatsApp
            </a>
            <a
              href="#servicos"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-display font-semibold text-white transition-colors hover:bg-white/10"
            >
              Conheça os serviços
              <ArrowRight className="h-4 w-4" />
            </a>
          </AnimatedContainer>
        </div>

        {/* Prova social imediata */}
        <AnimatedContainer delay={1.8} className="px-6 pb-10">
          <p className="mb-4 text-center font-display text-[11px] uppercase tracking-[0.25em] text-white/40">
            Empresas que confiam na TACONTUDO
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            {CLIENTS.map((name) => {
              const logoUrl = CLIENT_LOGOS[name];
              return logoUrl ? (
                <img
                  key={name}
                  src={logoUrl}
                  alt={name}
                  className={`h-6 w-auto object-contain opacity-50 brightness-0 invert transition-opacity hover:opacity-100 sm:h-7 ${LOGO_SCALE[name] ?? ''}`}
                />
              ) : (
                <span key={name} className="font-display text-base font-semibold text-white/50 sm:text-lg">
                  {name}
                </span>
              );
            })}
          </div>
        </AnimatedContainer>
        </>
        )}
      </div>
    </section>
  );
}
