import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  return (
    <section id="sobre" className="relative isolate overflow-hidden border-t border-white/10 bg-ink-soft px-6 py-24">
      {/* Fundo decorativo dark abstrato (gerado por IA). Some sozinho se não existir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.45]"
        style={{ backgroundImage: 'url(/sobre-bg.webp)' }}
      />
      {/* Véu mais forte à esquerda (título + vídeo); direita liberada pras fitas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-soft/75 via-ink-soft/15 to-transparent"
      />
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <AnimatedContainer>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Conheça a TACONTUDO
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Qualidade e segurança, na prática"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-4 text-white/60">
              Desde 2020 testando, auditando e blindando o software de quem não pode
              correr riscos. Em pouco mais de 20 segundos, veja como.
            </p>
          </AnimatedContainer>
        </div>

        {/* Player com borda em gradiente e brilho da marca */}
        <div className="relative rounded-2xl bg-gradient-to-br from-brand-blue/50 via-white/10 to-brand-blue/20 p-px shadow-2xl shadow-brand-blue/20">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              controls={started}
              preload="metadata"
              playsInline
              onPlay={() => setStarted(true)}
            >
              <source src="/tacontudo_launch_promo_opt.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>

            {!started && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Reproduzir vídeo de apresentação da TACONTUDO"
                className="group absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors hover:bg-ink/10"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-yellow text-ink shadow-lg shadow-brand-yellow/30 transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-8 w-8 fill-current" strokeWidth={0} />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
