import { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import { useInViewOnce, prefersReducedMotion } from './use-in-view';

interface Stat {
  /** Texto final exibido (fallback sem motion e leitores de tela). */
  display: string;
  /** Alvos do count-up: um número simples ou uma faixa (a–b). */
  end: number;
  end2?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  fonte: string;
}

const STATS: Stat[] = [
  {
    display: '< 12',
    end: 12,
    prefix: '< ',
    suffix: ' meses',
    label: 'até o payback típico do investimento em RPA',
    fonte: 'Deloitte Global RPA Survey',
  },
  {
    display: '92%',
    end: 92,
    suffix: '%',
    label: 'das empresas reportam melhora em compliance',
    fonte: 'Deloitte Global RPA Survey',
  },
  {
    display: '30–50%',
    end: 30,
    end2: 50,
    suffix: '%',
    label: 'dos projetos falham — por falta de método, não de tecnologia',
    fonte: 'EY, Get Ready for Robots',
  },
];

/** Uma linha editorial: número gigante + rótulo + fonte, com count-up ao entrar. */
function StatRow({ stat, index }: { stat: Stat; index: number }) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>(0.5);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!inView || !el) return;
    if (prefersReducedMotion()) {
      el.textContent = stat.display;
      return;
    }
    const obj = { a: 0, b: 0 };
    const fmt = () => {
      const a = Math.round(obj.a);
      const b = Math.round(obj.b);
      el.textContent =
        stat.end2 != null
          ? `${a}–${b}${stat.suffix ?? ''}`
          : `${stat.prefix ?? ''}${a}${stat.suffix ?? ''}`;
    };
    const anim = animate(obj, {
      a: stat.end,
      b: stat.end2 ?? 0,
      duration: 1600,
      delay: index * 120,
      ease: 'outExpo',
      onUpdate: fmt,
      onComplete: fmt,
    });
    return () => {
      anim.pause();
    };
  }, [inView, stat, index]);

  return (
    <div
      ref={ref}
      className="grid items-baseline gap-x-8 gap-y-2 border-b border-white/10 py-9 sm:grid-cols-[minmax(220px,1fr)_2fr_auto] sm:py-11"
    >
      <span
        ref={numRef}
        aria-label={`${stat.display}${stat.suffix && !stat.display.includes('%') ? stat.suffix : ''}`}
        className="font-display text-5xl font-extrabold tabular-nums tracking-tight text-brand-yellow sm:text-6xl lg:text-7xl"
      >
        {stat.display}
        {stat.end2 == null && stat.suffix === ' meses' ? ' meses' : ''}
      </span>
      <p className="max-w-md text-base leading-relaxed text-white/75 sm:text-lg">{stat.label}</p>
      <p className="font-display text-[11px] uppercase tracking-[0.18em] text-white/35 sm:justify-self-end">
        {stat.fonte}
      </p>
    </div>
  );
}

/** Os três números que contam a história: retorno rápido → risco real → o valor está no método. */
export default function RpaNumeros() {
  return (
    <section className="border-t border-white/10 bg-ink px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 max-w-2xl">
          <TextStagger
            text="Três números, uma conclusão"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
        </div>

        <div className="border-t border-white/10">
          {STATS.map((stat, i) => (
            <StatRow key={stat.display} stat={stat} index={i} />
          ))}
        </div>

        {/* A tese — a leitura que os três números montam juntos */}
        <AnimatedContainer delay={0.3} className="mt-16">
          <blockquote className="max-w-3xl">
            <p className="font-display text-2xl font-bold leading-snug tracking-tight text-white sm:text-4xl">
              RPA sem teste e sem segurança é só automatizar o risco{' '}
              <span className="hero-kw">mais rápido</span>.
            </p>
            <p className="mt-5 max-w-xl text-white/60">
              O retorno vem em meses. As falhas vêm da pressa. O valor está em fazer
              direito — e fazer direito é a nossa casa desde 2020.
            </p>
          </blockquote>
        </AnimatedContainer>
      </div>
    </section>
  );
}
