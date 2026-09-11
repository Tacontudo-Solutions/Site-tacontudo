import { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type MotionStyle,
} from 'motion/react';
import { TextStagger } from '@/components/ui/hero-animated';
import { useIsDesktop } from '@/hooks/use-is-desktop';

/** Frases de efeito reveladas conforme o usuário rola — formato "propaganda",
 *  tom institucional sério. Cada bloco ocupa boa altura pra dar respiro.
 *  `chave` = palavra que acende por dentro quando a linha passa. */
const FRASES: { texto: string; chave: string[] }[] = [
  { texto: 'Estrutura não é discurso. É operação diária.', chave: ['Estrutura'] },
  { texto: 'Cada entrega carrega processos, governança e gestão.', chave: ['governança'] },
  { texto: 'É assim que transformamos qualidade em rotina.', chave: ['qualidade'] },
];

/** Traçado da "linha de jornada": desce serpenteando entre as frases
 *  (bojo à direita da 1ª, à esquerda da 2ª, à direita da 3ª). */
const TRACADO =
  'M 500,-10 C 850,150 850,320 500,470 C 150,620 150,790 500,940 C 850,1090 850,1260 500,1410';

/** Onde cada frase está no percurso da linha (fração do traçado ≈ fração da
 *  altura da seção: centro dos 3 blocos iguais). */
const CENTROS = [1 / 6, 1 / 2, 5 / 6];

function Frase({
  frase,
  chave,
  centro,
  progresso,
  estatico,
  desktop,
  divisor,
}: {
  frase: string;
  chave: string[];
  centro: number;
  progresso: MotionValue<number>;
  estatico: boolean;
  desktop: boolean;
  divisor: boolean;
}) {
  // Brilho acende conforme a ponta da linha se aproxima da frase e permanece
  // depois que ela passa (a linha fica desenhada atravessando o bloco).
  const rampa = useTransform(progresso, [centro - 0.14, centro + 0.02], [0, 1], { clamp: true });
  const brilho = useTransform(rampa, (v) => (estatico ? 1 : v));
  const a1 = useTransform(brilho, [0, 1], [0, 0.38]);
  const a2 = useTransform(brilho, [0, 1], [0, 0.16]);
  // drop-shadow (e não text-shadow): aplicado depois do recorte da máscara do
  // stagger, o brilho acompanha o desenho das letras em vez de virar retângulo.
  const filtro = useMotionTemplate`drop-shadow(0 0 9px rgba(255,196,0,${a1})) drop-shadow(0 0 24px rgba(255,196,0,${a2}))`;

  return (
    <div
      className={`flex min-h-[40svh] items-center justify-center py-14 text-center sm:min-h-[42svh] sm:py-16 ${
        divisor ? 'border-t border-white/5' : ''
      }`}
    >
      {/* aura da frase via filter (drop-shadow no scroll é caro — só desktop);
          --kw alimenta o CSS da palavra-chave (cor interna + bloom respirando,
          este também gated a md+ no index.css). A cor sempre acende. */}
      <motion.div style={{ filter: desktop ? filtro : undefined, '--kw': brilho } as MotionStyle}>
        <TextStagger
          text={frase}
          stagger={0.02}
          highlight={chave}
          highlightClassName="manifesto-kw"
          className="font-display text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl md:text-5xl"
        />
      </motion.div>
    </div>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduzido = useReducedMotion();
  const desktop = useIsDesktop();

  // A linha se desenha conforme a seção atravessa a tela; spring suaviza o traço.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const progresso = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });
  // Com motion reduzido a linha aparece inteira, estática.
  const pathLength = useTransform(progresso, (v) => (reduzido ? 1 : v));

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/10 bg-ink px-6">
      {/* Linha de jornada: SVG de fundo que se desenha no scroll,
          gradiente azul → amarelo da marca + glow sutil por trás. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="manifesto-linha" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#478ac9" />
            <stop offset="100%" stopColor="#FFC400" />
          </linearGradient>
        </defs>
        {/* Glow: mesmo traçado, mais grosso e quase transparente */}
        <motion.path
          d={TRACADO}
          fill="none"
          stroke="url(#manifesto-linha)"
          strokeWidth="7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-15"
          style={{ pathLength }}
        />
        <motion.path
          d={TRACADO}
          fill="none"
          stroke="url(#manifesto-linha)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="opacity-60"
          style={{ pathLength }}
        />
      </svg>

      <div className="relative mx-auto max-w-5xl">
        {FRASES.map(({ texto, chave }, i) => (
          <Frase
            key={texto}
            frase={texto}
            chave={chave}
            centro={CENTROS[i]}
            progresso={progresso}
            estatico={!!reduzido}
            desktop={desktop}
            divisor={i > 0}
          />
        ))}
      </div>
    </section>
  );
}
