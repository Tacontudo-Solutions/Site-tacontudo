import { LayeredText, type LayeredLine } from '@/components/ui/layered-text';

const NBSP = ' ';

/** Cascata: a palavra de baixo de cada linha é a de cima da próxima —
 *  no hover a pilha desliza e revela a camada seguinte em amarelo. */
const PALAVRAS: LayeredLine[] = [
  { top: NBSP, bottom: 'Pessoas' },
  { top: 'Pessoas', bottom: 'Processos' },
  { top: 'Processos', bottom: 'Governança' },
  { top: 'Governança', bottom: 'Qualidade' },
  { top: 'Qualidade', bottom: 'Segurança' },
  { top: 'Segurança', bottom: 'Confiança' },
  { top: 'Confiança', bottom: NBSP },
];

/** Interlúdio visual: a base da TACONTUDO em seis palavras, em texto
 *  isométrico interativo (hover desliza as camadas). */
export default function Interlude() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink px-6 py-20">
      {/* Fundo: blueprint isométrico de escadarias (gerado por IA) — ecoa a
          geometria da cascata; centro escuro preserva a leitura das palavras */}
      <img
        src="/cascata.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center"
      />
      <div className="mx-auto max-w-7xl text-center">
        {/* Decorativo pra leitores de tela: as palavras repetem em camadas */}
        <div aria-hidden="true">
          <LayeredText lines={PALAVRAS} className="py-12 sm:py-16" />
        </div>
      </div>
    </section>
  );
}
