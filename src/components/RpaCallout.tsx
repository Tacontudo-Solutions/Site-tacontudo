import { ArrowRight, Workflow } from 'lucide-react';
import MetalButton from '@/components/ui/metal-button';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/** Chamada da home pra página /rpa/ — frase magnética + hiperlink. */
export default function RpaCallout() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink-soft px-6 py-20">
      {/* Glow amarelo sutil — sinaliza "novo" sem gritar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(40% 60% at 85% 50%, rgba(255,196,0,0.07) 0%, rgba(11,18,32,0) 70%)' }}
      />

      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <AnimatedContainer>
            <p className="mb-3 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-yellow">
              <Workflow className="h-4 w-4" />
              Automação de Processos · RPA
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Sua equipe pensa. Os robôs repetem."
            stagger={0.02}
            className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-3 text-white/60">
              RPA com a régua TACONTUDO: robôs testados, auditáveis e em conformidade —
              devolvendo horas para a sua operação todos os dias.
            </p>
          </AnimatedContainer>
        </div>
        <AnimatedContainer direction="right" delay={0.3} className="shrink-0">
          <MetalButton>
            <a
              href="/rpa/"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink"
            >
              Conhecer o RPA
              <ArrowRight className="h-4 w-4" />
            </a>
          </MetalButton>
        </AnimatedContainer>
      </div>
    </section>
  );
}
