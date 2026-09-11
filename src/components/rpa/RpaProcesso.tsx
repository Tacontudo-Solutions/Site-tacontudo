import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { Search, PenTool, ShieldCheck, Activity } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import { useInViewOnce, prefersReducedMotion } from './use-in-view';

interface Passo {
  icon: LucideIcon;
  num: string;
  title: string;
  desc: string;
  destaque?: boolean;
}

const PASSOS: Passo[] = [
  {
    icon: Search,
    num: '01',
    title: 'Mapear',
    desc: 'Entramos no seu processo e encontramos onde as horas vazam.',
  },
  {
    icon: PenTool,
    num: '02',
    title: 'Desenhar',
    desc: 'O robô é desenhado para o seu fluxo — não o contrário.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    title: 'Testar',
    desc: 'A mesma régua de QA que aplicamos desde 2020. Nenhum robô toca seus dados sem passar por ela.',
    destaque: true,
  },
  {
    icon: Activity,
    num: '04',
    title: 'Operar',
    desc: 'Credenciais em cofre, cada ação em log, monitoramento contínuo.',
  },
];

/** Um passo da jornada: chip que "acende" com pop quando o scroll chega nele. */
function PassoItem({ passo }: { passo: Passo }) {
  const { icon: Icon, num, title, desc, destaque } = passo;
  const { ref, inView } = useInViewOnce<HTMLLIElement>(0.6);
  const chipRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inView || prefersReducedMotion()) return;
    if (chipRef.current) {
      animate(chipRef.current, {
        scale: [0.55, 1],
        duration: 700,
        ease: 'outBack(2.4)',
      });
    }
    if (bodyRef.current) {
      animate(bodyRef.current, {
        opacity: [0, 1],
        translateX: [18, 0],
        duration: 800,
        delay: 120,
        ease: 'outCubic',
      });
    }
  }, [inView]);

  const aceso = inView;

  return (
    <li ref={ref} className="relative grid grid-cols-[44px_1fr] gap-x-6 sm:gap-x-9">
      {/* Chip na trilha — acende quando o scroll chega */}
      <span
        ref={chipRef}
        className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-ink transition-colors duration-500 ${
          aceso
            ? destaque
              ? 'border-brand-yellow text-brand-yellow shadow-[0_0_22px_-4px_rgba(255,196,0,0.55)]'
              : 'border-brand-blue text-brand-blue shadow-[0_0_18px_-6px_rgba(71,138,201,0.6)]'
            : 'border-white/15 text-white/30'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <div ref={bodyRef} className="pb-14 pt-1.5 sm:pb-16" style={{ opacity: prefersReducedMotion() ? 1 : 0 }}>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-display text-xs font-semibold tabular-nums tracking-[0.2em] text-white/30">
            {num}
          </span>
          <h3
            className={`font-display text-xl font-bold tracking-tight sm:text-2xl ${
              destaque ? 'text-brand-yellow' : 'text-white'
            }`}
          >
            {title}
          </h3>
          {destaque && (
            <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              a régua da casa
            </span>
          )}
        </div>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">{desc}</p>
      </div>
    </li>
  );
}

/** O diferencial da casa: robô aqui é tratado como software crítico. */
export default function RpaProcesso() {
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // Linha de jornada: o preenchimento azul→amarelo persegue o ponto focal do
  // viewport (60% da altura) — mesmo padrão de scroll-scrub do Platform.tsx.
  useEffect(() => {
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!rail || !fill) return;
    if (prefersReducedMotion()) {
      fill.style.transform = 'scaleY(1)';
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = rail.getBoundingClientRect();
      if (rect.height <= 0) return;
      const focal = window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (focal - rect.top) / rect.height));
      fill.style.transform = `scaleY(${p})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="processo" className="border-t border-white/10 bg-ink-soft px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 max-w-2xl">
          <TextStagger
            text="Robô aqui é software crítico"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-4 text-white/70">
              Um robô tem acesso direto aos seus dados e sistemas. Tratamos ele com o
              respeito que isso exige.
            </p>
          </AnimatedContainer>
        </div>

        {/* Jornada: trilha vertical + preenchimento que cresce com o scroll */}
        <div className="relative">
          <div
            ref={railRef}
            aria-hidden="true"
            className="absolute bottom-14 left-[21px] top-1.5 w-0.5 bg-white/10 sm:bottom-16"
          >
            <div
              ref={fillRef}
              className="h-full w-full origin-top"
              style={{
                transform: 'scaleY(0)',
                background: 'linear-gradient(to bottom, #478ac9 0%, #FFC400 100%)',
                boxShadow: '0 0 12px rgba(255, 196, 0, 0.35)',
              }}
            />
          </div>

          <ol className="relative">
            {PASSOS.map((passo) => (
              <PassoItem key={passo.num} passo={passo} />
            ))}
          </ol>
        </div>

        <AnimatedContainer delay={0.2}>
          <p className="text-sm text-white/50">
            É o mesmo cuidado que <span className="font-semibold text-white/80">C&amp;A, GOL, Natura e Sicredi</span> já
            conhecem no nosso QA — agora construindo e blindando robôs.
          </p>
        </AnimatedContainer>
      </div>
    </section>
  );
}
