import { Fragment } from 'react';
import { motion, type HTMLMotionProps, type Transition } from 'motion/react';

/**
 * Tipografia cinética + reveals de scroll (adaptado do bloco "hero-animated"
 * pro nosso stack: sem shadcn/cva — classes Tailwind direto, cores da marca).
 * Tudo respeita prefers-reduced-motion via <MotionConfig reducedMotion="user">
 * no root da página.
 */

export type TransformDirection = 'top' | 'bottom' | 'left' | 'right' | 'z';

const CHAR_TRANSITION: Transition = { ease: [0.25, 0.1, 0.25, 1], duration: 0.5 };

/** Variantes de personagem: cada letra nasce deslocada e "sobe" pro lugar. */
const charVariants = (direction: TransformDirection = 'bottom') => ({
  hidden: {
    x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
    y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
    scale: direction === 'z' ? 0 : 1,
    opacity: 0,
  },
  visible: { x: 0, y: 0, scale: 1, opacity: 1 },
});

/** Variantes de bloco: deslocamento sutil em px (pra parágrafos/CTAs). */
const blockVariants = (direction: TransformDirection = 'bottom') => ({
  hidden: {
    x: direction === 'left' ? -32 : direction === 'right' ? 32 : 0,
    y: direction === 'top' ? -32 : direction === 'bottom' ? 32 : 0,
    scale: direction === 'z' ? 0.92 : 1,
    opacity: 0,
  },
  visible: { x: 0, y: 0, scale: 1, opacity: 1 },
});

function Word({
  word,
  direction = 'bottom',
  transition = CHAR_TRANSITION,
  className = '',
}: {
  word: string;
  direction?: TransformDirection;
  transition?: Transition;
  className?: string;
}) {
  return (
    // overflow-hidden faz cada palavra funcionar como "máscara": as letras
    // sobem de dentro dela (efeito de reveal tipográfico). px + -mx: respiro
    // horizontal DENTRO da máscara pro itálico não ser fatiado na borda
    // (ex.: o "e" solto), sem alterar o espaçamento visual entre palavras.
    <span className={`inline-block overflow-hidden text-nowrap align-top px-[0.12em] -mx-[0.12em] ${className}`}>
      {word.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={charVariants(direction)}
          transition={transition}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

interface TextStaggerProps extends HTMLMotionProps<'div'> {
  text: string;
  /** Atraso entre letras (s). */
  stagger?: number;
  /** Atraso antes da primeira letra (s) — pra encadear linhas. */
  delay?: number;
  direction?: TransformDirection;
  /** Palavras a destacar (comparação sem caixa, ignora pontuação anexa). */
  highlight?: string[];
  /** Classe extra aplicada às palavras destacadas. */
  highlightClassName?: string;
}

/** Título com reveal letra-a-letra quando entra na viewport. */
export function TextStagger({
  text,
  stagger = 0.035,
  delay = 0,
  direction = 'bottom',
  highlight,
  highlightClassName = '',
  ...props
}: TextStaggerProps) {
  const isHighlighted = (word: string) =>
    !!highlight?.some(
      (h) => h.toLowerCase() === word.toLowerCase().replace(/[.,;:!?…]+$/u, ''),
    );

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      {...props}
    >
      {text.split(' ').map((word, i, arr) => (
        <Fragment key={i}>
          <Word
            word={word}
            direction={direction}
            className={isHighlighted(word) ? highlightClassName : ''}
          />
          {i < arr.length - 1 && ' '}
        </Fragment>
      ))}
    </motion.div>
  );
}

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  direction?: TransformDirection;
  delay?: number;
}

/** Bloco que revela no scroll (fade + deslocamento sutil). */
export function AnimatedContainer({
  direction = 'bottom',
  delay = 0,
  transition,
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      variants={blockVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay, ...transition }}
      {...props}
    />
  );
}
