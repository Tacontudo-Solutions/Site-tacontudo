import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { SpeederLoader } from '@/components/ui/speeder-loader';
import { WHATSAPP } from '@/lib/site';

export interface ImmersiveChapter {
  eyebrow: string;
  title: string;
  desc: string;
}

export interface ImmersiveConfig {
  /** Rótulo pequeno do topo (nome do serviço). */
  label: string;
  /** Prefixo do caminho dos frames, ex.: '/immersive/sites/frame-'. */
  frameBase: string;
  mobileFrameBase?: string;
  /** Quantidade de frames na sequência. */
  frameCount: number;
  /** Dígitos do contador (frame-001 → 3). */
  framePad: number;
  /** Extensão dos frames, ex.: 'webp'. */
  frameExt: string;
  /** Capítulos de texto, sincronizados ao progresso do scroll. */
  chapters: ImmersiveChapter[];
  /** Texto curto acima do botão de CTA no final. */
  ctaLead: string;
  /** Pula os N primeiros frames (corta "saltos"/flash de abertura do vídeo). */
  startFrame?: number;
  /** Incrementar quando os frames forem regerados — quebra o cache do navegador. */
  version?: string | number;
}

/** Quantas "telas" de scroll a experiência ocupa (mais = scrub mais lento/suave). */
const TRACK_VH = 480;

/** Curva de avanço dos frames: >1 desacelera a chegada no clímax (ease-out). */
const EASE = 1.5;

/**
 * Suavização do scrub (0..1): quanto o progresso renderizado se aproxima do
 * alvo do scroll a cada frame. Menor = mais "inércia"/glide cinematográfico;
 * maior = mais colado ao dedo. ~0.14 dá fluidez sem parecer atraso.
 */
const SMOOTH = 0.14;

/** Mapeia o progresso do scroll (0..1) para o progresso do vídeo, com ease-out no fim. */
function easeProgress(p: number) {
  return 1 - Math.pow(1 - p, EASE);
}

function frameUrl(c: ImmersiveConfig, i: number, isNarrow: boolean = false) {
  const v = c.version != null ? `?v=${c.version}` : '';
  const base = isNarrow && c.mobileFrameBase ? c.mobileFrameBase : c.frameBase;
  return `${base}${String(i).padStart(c.framePad, '0')}.${c.frameExt}${v}`;
}

export default function ImmersiveExperience({
  config,
  onClose,
}: {
  config: ImmersiveConfig;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  /** Alvo do scrub: progresso bruto do scroll (0..1), atualizado no onScroll. */
  const targetRef = useRef(0);
  /** Progresso efetivamente renderizado, que persegue o alvo com damping. */
  const renderedRef = useRef(0);
  const rafRef = useRef(0);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isNarrow, setIsNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );

  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Layout vertical simples (sem scrub) em telas estreitas ou movimento reduzido:
  // o vídeo 16:9 não cobre bem o retrato do celular. A versão vertical (9:16) é à parte.
  const simpleLayout = reduceMotion;

  // Desenha o frame correspondente ao progresso, com "cover fit" e DPR.
  const drawFrame = useCallback((p: number) => {
    const canvas = canvasRef.current;
    const imgs = imagesRef.current;
    if (!canvas || imgs.length === 0) return;
    // Ease-out: o vídeo desacelera ao chegar no clímax e o último frame cai
    // exatamente no fim do scroll — sem congelar e sem parecer corte.
    const fp = easeProgress(p);
    // Pula os primeiros frames (startFrame): a experiência abre já depois do
    // "salto" de abertura do vídeo, e o scroll percorre [startFrame .. último].
    const last = imgs.length - 1;
    const start = Math.min(config.startFrame ?? 0, last);
    const idx = Math.min(last, Math.max(start, start + Math.round(fp * (last - start))));
    const img = imgs[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let dw: number, dh: number, dx: number, dy: number;
    if (cr > ir) {
      dw = cw;
      dh = cw / ir;
      dx = 0;
      dy = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * ir;
      dy = 0;
      dx = (cw - dw) / 2;
    }
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [config.startFrame]);

  // Acompanha largura/orientação para alternar entre scrub e layout vertical.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pré-carrega toda a sequência de frames (pulado no layout simples — não baixa no mobile).
  useEffect(() => {
    if (simpleLayout) return;
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= config.frameCount; i++) {
      const img = new Image();
      img.src = frameUrl(config, i, isNarrow);
      const done = () => {
        if (cancelled) return;
        count += 1;
        setLoaded(count);
        if (count === config.frameCount) {
          setReady(true);
          requestAnimationFrame(() => drawFrame(0));
        }
      };
      img.onload = done;
      img.onerror = done;
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, [config, drawFrame, simpleLayout, isNarrow]);

  // Trava o scroll do body e habilita ESC pra fechar.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // Dimensiona o canvas para a viewport (com DPR) e redesenha.
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      drawFrame(renderedRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [ready, drawFrame]);

  // Loop de scrub suavizado: o progresso renderizado persegue o alvo do scroll
  // com damping (SMOOTH). Roda só enquanto há diferença a animar — quando
  // alcança o alvo, o rAF para sozinho (sem custo em repouso).
  const tick = useCallback(() => {
    const loop = () => {
      const target = targetRef.current;
      const rendered = renderedRef.current;
      const diff = target - rendered;
      // "Snap" quando muito perto pra fechar a animação e evitar jitter de fim.
      const next = Math.abs(diff) < 0.0004 ? target : rendered + diff * SMOOTH;
      renderedRef.current = next;
      drawFrame(next);
      setProgress(next);
      if (Math.abs(target - next) > 0.0004) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = 0;
      }
    };
    loop();
  }, [drawFrame]);

  const startLoop = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // Liga o scroll ao alvo do scrub (o desenho fica por conta do loop).
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0;
    targetRef.current = p;
    startLoop();
  }, [startLoop]);

  // Garante que o loop encerre ao desmontar.
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  }, []);

  const N = config.chapters.length;
  const frameProgress = easeProgress(progress);
  const activeChapter = Math.min(N - 1, Math.floor(frameProgress * N));

  // ---- Layout vertical (mobile / movimento reduzido): storyboard com 1 frame por capítulo ----
  if (simpleLayout) {
    return (
      <div className="fixed inset-0 z-[200] overflow-y-auto bg-ink">
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="fixed right-4 top-4 z-10 rounded-full bg-white/10 p-2.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mx-auto max-w-xl px-5 pb-20 pt-20">
          <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-brand-blue">
            Serviço
          </p>
          <h2 className="mb-10 font-display text-2xl font-bold tracking-tight">
            {config.label}
          </h2>

          <div className="space-y-12">
            {config.chapters.map((ch, i) => {
              const fno = Math.max(
                1,
                Math.min(
                  config.frameCount,
                  Math.round((i / Math.max(1, N - 1)) * (config.frameCount - 1)) + 1,
                ),
              );
              return (
                <div key={ch.title}>
                  <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/10">
                    <img src={frameUrl(config, fno, isNarrow)} alt="" loading="lazy" className="w-full" />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-brand-yellow backdrop-blur-sm">
                      {ch.eyebrow}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{ch.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{ch.desc}</p>
                </div>
              );
            })}
          </div>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 flex w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-4 font-display font-semibold text-ink shadow-lg shadow-brand-yellow/25"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={config.label}
      className="fixed inset-0 z-[200] overflow-y-auto overflow-x-hidden bg-ink outline-none"
    >
      {/* Barra de progresso */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[3px] bg-white/10">
        <div
          className="h-full bg-brand-yellow transition-[width] duration-75"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Topo: rótulo + fechar (fixos) */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5">
        <span className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
          {config.label}
        </span>
        <button
          onClick={onClose}
          aria-label="Fechar experiência"
          className="pointer-events-auto rounded-full bg-white/10 p-2.5 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Preloader — speeder "hyper-speed" nas cores da marca */}
      {!ready && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 overflow-hidden bg-ink">
          <SpeederLoader />
          <p className="font-display text-sm uppercase tracking-[0.25em] text-white/50">
            Preparando experiência
          </p>
          <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-brand-yellow transition-[width] duration-150"
              style={{ width: `${(loaded / config.frameCount) * 100}%` }}
            />
          </div>
          <p className="font-display text-xs tabular-nums text-white/40">
            {Math.round((loaded / config.frameCount) * 100)}%
          </p>
        </div>
      )}

      {/* Trilho de scroll: a cena fica pinned enquanto rola */}
      <div style={{ height: `${TRACK_VH}vh` }} className="relative">
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

          {/* Vinheta pra legibilidade do texto */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-ink/50" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

          {/* Capítulos sincronizados */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-24 sm:px-12 sm:pb-28">
            <div className="relative mx-auto h-44 max-w-3xl sm:h-40">
              {config.chapters.map((ch, i) => {
                const isActive = i === activeChapter;
                return (
                  <div
                    key={ch.title}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(16px)',
                    }}
                  >
                    <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-brand-yellow">
                      {ch.eyebrow}
                    </p>
                    <h3 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
                      {ch.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                      {ch.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Índice de capítulo */}
          <div className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex">
            {config.chapters.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="font-display text-xs tabular-nums transition-colors duration-300"
                  style={{ color: i === activeChapter ? '#f1c50e' : 'rgba(255,255,255,0.35)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="h-px transition-all duration-300"
                  style={{
                    width: i === activeChapter ? 28 : 14,
                    background: i === activeChapter ? '#f1c50e' : 'rgba(255,255,255,0.25)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Dica de scroll (início) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-7 flex flex-col items-center gap-1 transition-opacity duration-500"
            style={{ opacity: progress < 0.04 ? 1 : 0 }}
          >
            <span className="font-display text-[11px] uppercase tracking-[0.25em] text-white/55">
              Role para explorar
            </span>
            <ChevronDown className="h-5 w-5 animate-bounce text-white/55" />
          </div>

          {/* CTA final */}
          <div
            className="absolute inset-x-0 bottom-9 flex flex-col items-center gap-3 transition-opacity duration-500"
            style={{
              opacity: progress > 0.92 ? 1 : 0,
              pointerEvents: progress > 0.92 ? 'auto' : 'none',
            }}
          >
            <p className="font-display text-sm text-white/70">{config.ctaLead}</p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink shadow-lg shadow-brand-yellow/25 transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
