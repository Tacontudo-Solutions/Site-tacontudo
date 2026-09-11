import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Card interativo (adaptado do bloco "MagicBento" pro nosso stack): spotlight
 * e anel de borda que seguem o cursor (CSS em index.css, prefixo .magic-card),
 * mais partículas, tilt 3D, magnetismo e ripple no clique via GSAP.
 * Glow no azul da marca por padrão. Em touch/reduced-motion, as animações JS
 * desligam e ficam só o vidro e o conteúdo.
 */

const GLOW_BRAND_BLUE = '71, 138, 201'; // #478ac9

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  /** Trio RGB do glow, ex: "71, 138, 201". */
  glowRgb?: string;
  particleCount?: number;
}

export default function MagicCard({
  children,
  className = '',
  glowRgb = GLOW_BRAND_BLUE,
  particleCount = 8,
}: MagicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<number[]>([]);
  const hoveredRef = useRef(false);

  const clearParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    particlesRef.current.forEach((p) => {
      gsap.to(p, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => p.parentNode?.removeChild(p),
      });
    });
    particlesRef.current = [];
  }, []);

  const spawnParticles = useCallback(() => {
    const el = ref.current;
    if (!el || !hoveredRef.current) return;
    const { width, height } = el.getBoundingClientRect();

    for (let i = 0; i < particleCount; i++) {
      const id = window.setTimeout(() => {
        if (!hoveredRef.current || !ref.current) return;
        const p = document.createElement('div');
        p.style.cssText = `position:absolute;width:4px;height:4px;border-radius:50%;` +
          `background:rgba(${glowRgb},1);box-shadow:0 0 6px rgba(${glowRgb},0.6);` +
          `pointer-events:none;z-index:5;left:${Math.random() * width}px;top:${Math.random() * height}px;`;
        ref.current.appendChild(p);
        particlesRef.current.push(p);

        gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(p, {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        });
      }, i * 100);
      timeoutsRef.current.push(id);
    }
  }, [particleCount, glowRgb]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Touch não tem hover e reduced-motion pede calma — só o vidro estático.
    const animsOff =
      !window.matchMedia('(hover: hover)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Spotlight + border-glow (CSS puro, barato)
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
      if (animsOff) return;
      // Tilt 3D + magnetismo
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      gsap.to(el, {
        rotateX: ((y - cy) / cy) * -6,
        rotateY: ((x - cx) / cx) * 6,
        x: (x - cx) * 0.04,
        y: (y - cy) * 0.04,
        duration: 0.2,
        ease: 'power2.out',
        transformPerspective: 900,
      });
    };

    const enter = () => {
      hoveredRef.current = true;
      if (!animsOff) spawnParticles();
    };

    const leave = () => {
      hoveredRef.current = false;
      clearParticles();
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
    };

    const click = (e: MouseEvent) => {
      if (animsOff) return;
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.style.cssText = `position:absolute;width:10px;height:10px;border-radius:50%;` +
        `background:rgba(${glowRgb},0.45);left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;` +
        `pointer-events:none;z-index:6;`;
      el.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 40, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() },
      );
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('click', click);

    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('click', click);
      clearParticles();
    };
  }, [clearParticles, spawnParticles, glowRgb]);

  return (
    <div
      ref={ref}
      className={`magic-card ${className}`}
      style={{ '--glow-rgb': glowRgb } as CSSProperties}
    >
      <span className="magic-card__spotlight" aria-hidden="true" />
      <span className="magic-card__border-glow" aria-hidden="true" />
      <div className="magic-card__content">{children}</div>
    </div>
  );
}
