import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { Copy, GitCompareArrows, FileClock } from 'lucide-react';
import TechCard from '@/components/ui/tech-card';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import { useInViewOnce, prefersReducedMotion } from './use-in-view';

const DORES = [
  {
    icon: Copy,
    title: 'Dados digitados duas vezes',
    desc: 'O mesmo número entra no ERP, na planilha e no relatório. Três chances de erro.',
  },
  {
    icon: GitCompareArrows,
    title: 'Conciliação à mão',
    desc: 'Alguém compara, linha por linha, o que um sistema já sabe.',
  },
  {
    icon: FileClock,
    title: 'O relatório de sexta-feira',
    desc: 'Meia equipe parada montando o que um robô entrega pronto.',
  },
];

const REFRAO = ['Todo dia.', 'Toda semana.', 'Todo mês.'];

export default function RpaProblema() {
  const { ref: refraoRef, inView: refraoInView } = useInViewOnce<HTMLParagraphElement>(0.8);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  // Refrão em cascata: as três frases sobem uma a uma; a última cai em amarelo.
  useEffect(() => {
    if (!refraoInView || prefersReducedMotion()) return;
    animate(wordsRef.current.filter(Boolean), {
      opacity: [0, 1],
      translateY: [22, 0],
      duration: 750,
      delay: stagger(280),
      ease: 'outCubic',
    });
  }, [refraoInView]);

  return (
    <section className="border-t border-white/10 bg-ink px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <TextStagger
            text="Horas caras fazendo trabalho de robô"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-4 text-white/70">
              Ninguém contrata gente boa para digitar planilha. Mas é onde as horas vão.
            </p>
          </AnimatedContainer>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DORES.map(({ icon: Icon, title, desc }) => (
            <TechCard key={title} className="p-7">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-white/70">{desc}</p>
            </TechCard>
          ))}
        </div>

        {/* Refrão — cascata palavra a palavra no scroll */}
        <p
          ref={refraoRef}
          className="mt-16 flex flex-wrap justify-center gap-x-3 gap-y-1 text-center font-display text-2xl font-bold tracking-tight sm:text-3xl"
        >
          {REFRAO.map((frase, i) => (
            <span
              key={frase}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className={i === REFRAO.length - 1 ? 'text-brand-yellow' : 'text-white/45'}
              style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
            >
              {frase}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
