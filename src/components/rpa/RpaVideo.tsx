import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { TextStagger } from '@/components/ui/hero-animated';

/**
 * Slot B do vídeo — o filme de ~40s (VEO + HyperFrames).
 * Quando o corte final estiver pronto: salvar em `public/rpa/rpa-promo.mp4`
 * (+ poster em `public/rpa/rpa-poster.webp`) e preencher os caminhos abaixo.
 * Enquanto null, a seção inteira não renderiza — a página funciona sem ela.
 */
const RPA_VIDEO_SRC: string | null = '/rpa/rpa-promo.mp4';
const RPA_VIDEO_POSTER: string | null = '/rpa/rpa-poster.webp';

export default function RpaVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  if (!RPA_VIDEO_SRC) return null;

  const handlePlay = () => {
    setStarted(true);
    videoRef.current?.play();
  };

  return (
    <section className="border-t border-white/10 bg-ink px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <TextStagger
            text="Veja em 40 segundos"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
        </div>

        {/* Player com borda em gradiente — mesmo padrão do VideoIntro da home */}
        <div className="relative rounded-2xl bg-gradient-to-br from-brand-blue/50 via-white/10 to-brand-yellow/20 p-px shadow-2xl shadow-brand-blue/20">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              controls={started}
              preload="metadata"
              playsInline
              poster={RPA_VIDEO_POSTER ?? undefined}
              onPlay={() => setStarted(true)}
            >
              <source src={RPA_VIDEO_SRC} type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>

            {!started && (
              <button
                type="button"
                onClick={handlePlay}
                aria-label="Reproduzir vídeo sobre RPA da TACONTUDO"
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
