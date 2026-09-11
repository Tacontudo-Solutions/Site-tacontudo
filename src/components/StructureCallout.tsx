import { ArrowRight, Building2 } from 'lucide-react';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/** Chamada da home pra página "Nossa Estrutura" — frase de efeito + hiperlink. */
export default function StructureCallout() {
  return (
    <section className="border-t border-white/10 bg-ink px-6 py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <AnimatedContainer>
            <p className="mb-3 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              <Building2 className="h-4 w-4" />
              Estrutura &amp; Governança
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Estamos estruturados com uma equipe completa."
            stagger={0.02}
            className="font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-3 text-white/60">
              Além dos times técnicos, mantemos RH, Jurídico e Financeiro dedicados —
              a base que dá seriedade, conformidade e previsibilidade a cada entrega.
            </p>
          </AnimatedContainer>
        </div>
        <AnimatedContainer direction="right" delay={0.3} className="shrink-0">
          <a
            href="/nossa-estrutura/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-display font-semibold text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"
          >
            Conheça nossa estrutura
            <ArrowRight className="h-4 w-4" />
          </a>
        </AnimatedContainer>
      </div>
    </section>
  );
}
