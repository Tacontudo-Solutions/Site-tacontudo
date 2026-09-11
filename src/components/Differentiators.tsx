import type { LucideIcon } from 'lucide-react';
import { Scale, Sparkles, Bot, HeartHandshake } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { WHATSAPP } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const ITEMS: Item[] = [
  {
    icon: Scale,
    title: 'Independência e imparcialidade',
    desc: 'A qualidade do seu software é avaliada com total transparência, sem viés ou conflito de interesse.',
  },
  {
    icon: Sparkles,
    title: 'Qualidade como vantagem competitiva',
    desc: 'Qualidade vai muito além de encontrar falhas — é o motor que impulsiona inovação e confiança.',
  },
  {
    icon: Bot,
    title: 'Automação inteligente',
    desc: 'Unimos tecnologia de ponta e inteligência artificial para tornar os testes mais rápidos, eficazes e confiáveis.',
  },
  {
    icon: HeartHandshake,
    title: 'Foco em qualidade, foco em você',
    desc: 'Um time experiente e apaixonado por qualidade de software, lado a lado com o seu negócio.',
  },
];

const COMPLIANCE = [
  'TMMi',
  'ISTQB',
  'CBTS',
  'ISO 27001',
  'ISO 27002',
  'LGPD',
  'PCI-DSS',
  'ITIL',
  'COBIT',
  'Ethical Hacker',
];

export default function Differentiators() {
  return (
    <section
      id="diferenciais"
      className="relative overflow-hidden border-t border-white/10 bg-ink px-6 py-24"
    >
      {/* imagem de fundo abstrata */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-luminosity bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/diferenciais-bg.webp)' }}
      />
      
      {/* gradiente escuro sobre a imagem para garantir leitura do texto */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Coluna esquerda — título, CTA e selos de conformidade */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatedContainer>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Por que a TACONTUDO
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Ajudamos sua empresa a construir software confiável, eficiente e de alto desempenho"
            stagger={0.015}
            className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-5 max-w-md text-white/60">
              Mais do que apontar falhas, entregamos previsibilidade: processos
              confiáveis, métricas claras e segurança em cada etapa do ciclo.
            </p>
          </AnimatedContainer>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-6 py-3 font-display text-sm font-semibold text-ink shadow-lg shadow-brand-yellow/20 transition-transform hover:scale-105"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Falar no WhatsApp
          </a>

          <div className="mt-10">
            <p className="mb-3 font-display text-[11px] uppercase tracking-[0.2em] text-white/40">
              Padrões que seguimos
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-display text-xs font-medium text-white/70"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna direita — lista editorial de diferenciais */}
        <div className="divide-y divide-white/10 lg:border-l lg:border-white/10 lg:pl-16">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-5 py-6 first:pt-0 last:pb-0"
            >
              <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/10 text-brand-yellow ring-1 ring-brand-yellow/20 transition-colors group-hover:bg-brand-yellow group-hover:text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
