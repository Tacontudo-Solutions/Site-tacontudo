import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

/**
 * Texto-revelação pra splash de carregamento (adaptado do bloco "reveal-text"
 * pro nosso stack): cada letra entra com spring; ao final, uma varredura na
 * cor de destaque passa letra a letra. Sem a camada de hover/imagens do
 * original — aqui é um loading, não um elemento interativo.
 */

interface RevealTextProps {
  text?: string;
  fontSize?: string;
  /** Atraso entre letras na entrada (s). */
  letterDelay?: number;
  /** Atraso entre letras na varredura (s). */
  overlayDelay?: number;
  /** Duração da varredura em cada letra (s). */
  overlayDuration?: number;
  /** Tempo (ms) pro spring da última letra assentar antes da varredura. */
  springDuration?: number;
  /** Dispara quando a sequência inteira termina. */
  onComplete?: () => void;
}

export function RevealText({
  text = 'TACONTUDO',
  fontSize = 'text-6xl',
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  onComplete,
}: RevealTextProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const lastLetterDelay = (text.length - 1) * letterDelay * 1000;
    const overlayStart = lastLetterDelay + springDuration;
    const overlayEnd =
      overlayStart + (text.length - 1) * overlayDelay * 1000 + overlayDuration * 1000;

    const t1 = setTimeout(() => setShowOverlay(true), overlayStart);
    const t2 = setTimeout(() => onComplete?.(), overlayEnd + 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // onComplete fora das deps de propósito: recriar timers reiniciaria o splash
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, letterDelay, overlayDelay, overlayDuration, springDuration]);

  return (
    <div className="flex items-center justify-center" role="status" aria-label={text}>
      <div className="flex">
        {text.split('').map((letter, index) => (
          <motion.span
            key={index}
            className={`relative ${fontSize} font-display font-black tracking-tight text-white`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * letterDelay,
              type: 'spring',
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            {letter}
            {/* Varredura de destaque (amarelo da marca) letra a letra */}
            {showOverlay && (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 text-brand-yellow"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: index * overlayDelay,
                  duration: overlayDuration,
                  times: [0, 0.1, 0.7, 1],
                  ease: 'easeInOut',
                }}
              >
                {letter}
              </motion.span>
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
