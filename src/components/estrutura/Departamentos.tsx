import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { Users, Scale, Landmark, CheckCircle2, type LucideIcon } from 'lucide-react';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import { useIsDesktop } from '@/hooks/use-is-desktop';

interface Departamento {
  nome: string;
  icon: LucideIcon;
  /** Foto da equipe do setor (gerada por IA) — cai num fallback com o ícone
   *  enquanto o arquivo não existir em /public. */
  imagem: string;
  descricao: string;
  pontos: string[];
}

const DEPARTAMENTOS: Departamento[] = [
  {
    nome: 'Recursos Humanos',
    icon: Users,
    imagem: '/equipe-rh.webp',
    descricao:
      'A régua técnica das nossas entregas começa na porta de entrada. Nosso RH conduz ' +
      'seleção criteriosa, desenvolvimento contínuo e retenção de especialistas — um time ' +
      'estável significa conhecimento que permanece no seu projeto, com menos rotatividade ' +
      'e mais consistência em cada ciclo de entrega.',
    pontos: [
      'Seleção técnica criteriosa e certificações contínuas',
      'Cultura de qualidade e desenvolvimento de especialistas',
      'Retenção de talentos: conhecimento que fica no projeto',
    ],
  },
  {
    nome: 'Jurídico',
    icon: Scale,
    imagem: '/equipe-juridico.webp',
    descricao:
      'Toda relação comercial da TACONTUDO é sustentada por rigor jurídico: contratos claros, ' +
      'confidencialidade garantida e conformidade regulatória tratada com a seriedade que ' +
      'empresas reguladas exigem — de NDAs à LGPD, cada obrigação é formalizada e cumprida.',
    pontos: [
      'Contratos e acordos de confidencialidade (NDA) sólidos',
      'Conformidade LGPD de ponta a ponta',
      'Suporte a auditorias e processos de due diligence',
    ],
  },
  {
    nome: 'Financeiro',
    icon: Landmark,
    imagem: '/equipe-financeiro-v2.webp',
    descricao:
      'Saúde financeira é previsibilidade pro cliente. Faturamento organizado, obrigações ' +
      'fiscais em dia e gestão transparente — a solidez que garante continuidade de longo ' +
      'prazo nos projetos que assumimos, sem sobressaltos no meio do caminho.',
    pontos: [
      'Faturamento e obrigações fiscais rigorosamente em dia',
      'Gestão transparente e auditável',
      'Solidez pra contratos de longo prazo',
    ],
  },
];

/** O card em si (foto full-bleed + conteúdo) — usado tanto no deck pinado
 *  (desktop) quanto no fluxo normal (mobile). */
function CardDepartamento({ dep }: { dep: Departamento }) {
  const { nome, icon: Icon, imagem, descricao, pontos } = dep;
  const [imgErro, setImgErro] = useState(false);

  return (
    /* Fundo sólido (bg-ink) é essencial — card translúcido vazaria o de trás */
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink shadow-2xl shadow-black/50">
      <div className="grid md:grid-cols-[1.15fr_1fr]">
        {/* Foto da equipe — full-bleed, sangrando até as bordas do card */}
        <div className="relative min-h-[200px] bg-ink-soft sm:min-h-[320px] md:min-h-[520px]">
          {!imgErro ? (
            <img
              src={imagem}
              alt={`Equipe de ${nome} da TACONTUDO`}
              onError={() => setImgErro(true)}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : (
            /* Fallback enquanto a foto não existe: ícone sobre glow da marca */
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute h-48 w-48 rounded-full bg-brand-blue/15 blur-[70px]" />
              <Icon className="relative h-16 w-16 text-brand-blue/60" />
            </div>
          )}
          {/* Fusão suave da foto com o lado do conteúdo (só no desktop) */}
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-ink/60 md:block" />
        </div>

        {/* Conteúdo */}
        <div className="relative flex flex-col justify-center p-5 sm:p-10 md:-translate-y-6 lg:p-12">
          {/* Glow de borda à direita (equivalente ao brilho da referência) */}
          <div className="pointer-events-none absolute -right-16 top-1/2 h-64 w-40 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-[70px]" />

          <div className="relative">
            <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {nome}
            </h3>

            <p className="mt-4 text-justify text-sm leading-relaxed text-white/65 sm:text-base">
              {descricao}
            </p>

            <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
              {pontos.map((ponto) => (
                <li key={ponto} className="flex items-start gap-3 text-sm text-white/60">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                  {ponto}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Posicionamento de um card no deck pinado (desktop): o primeiro já está em
 *  cena; cada seguinte entra de baixo e desliza por cima conforme o scroll. */
function CardPilar({
  dep,
  index,
  total,
  progress,
}: {
  dep: Departamento;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Segmento do scroll em que este card entra (cards 1..N dividem o trilho por igual)
  const start = index === 0 ? 0 : (index - 1) / (total - 1);
  const end = index === 0 ? 1 : index / (total - 1);
  const y = useTransform(progress, [start, end], index === 0 ? ['0vh', '0vh'] : ['115vh', '0vh']);

  return (
    <div
      className={index === 0 ? 'relative' : 'absolute left-0 right-0 top-0'}
      style={{ zIndex: index + 1, transform: `translateY(${index * 24}px)` }}
    >
      <motion.div style={{ y }}>
        <CardDepartamento dep={dep} />
      </motion.div>
    </div>
  );
}

/** Deck pinado (desktop): trilho de 100svh por card + sticky; os cards entram
 *  um sobre o outro conforme o scroll. Pesado — só monta no desktop. */
function DeckPinado() {
  const deckRef = useRef<HTMLDivElement>(null);
  // Progresso 0→1 do trecho pinado: 0 quando o trilho encosta no topo da
  // viewport, 1 quando o fim do trilho chega — é o que dirige as entradas.
  const { scrollYProgress } = useScroll({
    target: deckRef,
    offset: ['start start', 'end end'],
  });

  return (
    // SEM overflow-hidden: em telas baixas o card pode passar de 100svh —
    // clipar cortaria o rodapé dele; sem clip, o restante aparece ao liberar.
    <div ref={deckRef} className="relative" style={{ height: `${DEPARTAMENTOS.length * 100}svh` }}>
      {/* pt (não center): o card fica logo abaixo da navbar ao pinar */}
      <div className="sticky top-0 h-svh pt-20 md:pt-24">
        <div className="relative w-full">
          {DEPARTAMENTOS.map((dep, i) => (
            <CardPilar
              key={dep.nome}
              dep={dep}
              index={i}
              total={DEPARTAMENTOS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Fluxo empilhado (mobile): cards um embaixo do outro, sem sticky nem
 *  transform ligado ao scroll — o deck pinado engasgava no celular. */
function ListaEmpilhada() {
  return (
    <div className="space-y-6">
      {DEPARTAMENTOS.map((dep) => (
        <AnimatedContainer key={dep.nome}>
          <CardDepartamento dep={dep} />
        </AnimatedContainer>
      ))}
    </div>
  );
}

export default function Departamentos() {
  const isDesktop = useIsDesktop();

  return (
    <section id="departamentos" className="border-t border-white/10 bg-ink-soft px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 max-w-2xl">
          <AnimatedContainer>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Por dentro da TACONTUDO
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Por trás do código, uma operação inteira."
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-4 text-white/60">
              Além dos times técnicos de desenvolvimento, QA e segurança, a TACONTUDO mantém
              departamentos internos dedicados — a base que dá seriedade, conformidade e
              previsibilidade a cada contrato.
            </p>
          </AnimatedContainer>
        </div>

        <div className="mt-10">
          {isDesktop ? <DeckPinado /> : <ListaEmpilhada />}
        </div>
      </div>
    </section>
  );
}
