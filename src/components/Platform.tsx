import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { QADORO_URL } from '@/lib/site';

/**
 * Seção da plataforma QA'doro com reveal 3D no scroll. O título permanece
 * estável para que a proposta seja legível desde o primeiro instante.
 */
export default function Platform() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(max, Math.max(min, value));
    let ticking = false;

    const updateScene = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxScroll = rect.height - viewportHeight;
      if (maxScroll <= 0) return;

      const progress = clamp(-rect.top / maxScroll, 0, 1);
      const isMobile = window.innerWidth <= 768;
      const startScale = isMobile ? 0.7 : 1.05;
      const endScale = isMobile ? 0.9 : 1;
      const rotation = 20 - progress * 20;
      const scale = startScale + progress * (endScale - startScale);
      const headerOffset = -progress * 50;

      let light = 0;
      if (rect.top > 0 && rect.top <= viewportHeight) {
        light = clamp((viewportHeight * 0.3 - rect.top) / (viewportHeight * 0.3), 0, 1);
      } else if (rect.top <= 0) {
        light = 1;
      }

      cardRef.current?.style.setProperty('--rx', `${rotation}deg`);
      cardRef.current?.style.setProperty('--sc', String(scale));
      headerRef.current?.style.setProperty('--ty', `${headerOffset}px`);
      imgRef.current?.style.setProperty('--light', String(light));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScene);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateScene();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="plataforma"
      className="relative bg-ink"
      style={{ height: '250vh' }}
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-5 pb-[10vh] pt-20">
        <div ref={headerRef} className="platform-header z-[2] mb-6 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-lg font-medium leading-snug text-white/85 sm:text-xl">
            Conheça a nova plataforma de gestão de testes e Qualidade de Software
          </h2>
          <p className="mt-3 font-display text-4xl font-extrabold tracking-tight text-brand-yellow sm:text-5xl lg:text-6xl">
            QA&rsquo;doro
          </p>
          <a
            href={QADORO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-2.5 font-display text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-brand-yellow hover:text-brand-yellow"
          >
            Saiba mais
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="z-[1] flex w-full max-w-3xl justify-center [perspective:1000px]">
          <div
            ref={cardRef}
            className="platform-card relative w-full overflow-hidden rounded-[24px] border-4 border-white/15 bg-black p-3 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] sm:p-4"
          >
            <img
              ref={imgRef}
              src="/qadoro-bg.webp"
              alt="Plataforma de gestão de testes e qualidade de software QA'doro da TACONTUDO"
              className="platform-img aspect-[43/24] w-full rounded-2xl bg-black object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
