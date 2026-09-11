import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Texto isométrico em camadas (adaptado do bloco "layered-text" pro nosso
 * stack — sem shadcn/next). Cada linha empilha duas palavras; no hover o GSAP
 * desliza tudo uma linha pra cima, revelando a camada de baixo (em amarelo).
 * O original controlava mobile com CSS vars órfãs — aqui é matchMedia real.
 */

export interface LayeredLine {
  top: string;
  bottom: string;
}

interface LayeredTextProps {
  lines: LayeredLine[];
  className?: string;
}

export function LayeredText({ lines, className = '' }: LayeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Métricas por breakpoint (mesmos valores do bloco original)
  const lineHeight = isMobile ? 35 : 60;
  const fontSize = isMobile ? '34px' : '72px';
  const stepX = isMobile ? 20 : 35;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const paragraphs = container.querySelectorAll('p');
    timelineRef.current = gsap.timeline({ paused: true });
    timelineRef.current.to(paragraphs, {
      y: -lineHeight,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.08,
    });

    let ativo = false;
    const sync = (v: boolean) => {
      if (v === ativo) return;
      ativo = v;
      if (v) timelineRef.current?.play();
      else timelineRef.current?.reverse();
    };

    const canHover = window.matchMedia('(hover: hover)').matches;
    let io: IntersectionObserver | undefined;

    // Desktop: ativação por proximidade real da tipografia (não pela caixa
    // larga do container) — o pointer precisa estar a menos de RAIO px da
    // união dos retângulos das linhas; nas bordas da seção o efeito reverte.
    const RAIO = 60;
    const move = (e: PointerEvent) => {
      let l = Infinity;
      let t = Infinity;
      let r = -Infinity;
      let b = -Infinity;
      container.querySelectorAll('li').forEach((li) => {
        const rc = li.getBoundingClientRect();
        l = Math.min(l, rc.left);
        t = Math.min(t, rc.top);
        r = Math.max(r, rc.right);
        b = Math.max(b, rc.bottom);
      });
      sync(
        e.clientX >= l - RAIO &&
          e.clientX <= r + RAIO &&
          e.clientY >= t - RAIO &&
          e.clientY <= b + RAIO,
      );
    };
    const leave = () => sync(false);

    if (canHover) {
      container.addEventListener('pointermove', move);
      container.addEventListener('pointerleave', leave);
    } else {
      // Touch: sem hover (o tap travava a animação) — a zona ativa é uma faixa
      // central estreita do viewport; ativa ao entrar e reverte ao sair dela,
      // ainda visível, pra quem rola ver as camadas voltando ao branco.
      io = new IntersectionObserver(
        ([entry]) => sync(entry.isIntersecting),
        { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
      );
      io.observe(container);
    }

    return () => {
      container.removeEventListener('pointermove', move);
      container.removeEventListener('pointerleave', leave);
      io?.disconnect();
      timelineRef.current?.kill();
      timelineRef.current = null;
    };
  }, [lines, lineHeight]);

  const centerIndex = Math.floor(lines.length / 2);

  return (
    <div
      ref={containerRef}
      className={`mx-auto cursor-pointer font-display font-extrabold uppercase tracking-[-2px] antialiased ${className}`}
      style={{ fontSize }}
    >
      <ul className="m-0 flex list-none flex-col items-center p-0">
        {lines.map((line, index) => {
          const even = index % 2 === 0;
          const translateX = (index - centerIndex) * stepX;
          return (
            <li
              key={index}
              className="relative overflow-hidden"
              style={{
                height: `${lineHeight}px`,
                transform: `translateX(${translateX}px) skew(${
                  even ? '60deg, -30deg' : '0deg, -30deg'
                }) scaleY(${even ? 0.66667 : 1.33333})`,
              }}
            >
              <p
                className="m-0 whitespace-nowrap px-[15px] text-white/90"
                style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight - 5}px` }}
              >
                {line.top}
              </p>
              <p
                className="m-0 whitespace-nowrap px-[15px] text-brand-yellow"
                style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight - 5}px` }}
              >
                {line.bottom}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
