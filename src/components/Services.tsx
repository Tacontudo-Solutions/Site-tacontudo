"use client";

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Code2, FileSearch, Bot, ClipboardCheck, ScrollText, ShieldCheck,
  ArrowRight, Globe, Smartphone, Blocks, Sparkles, X, Workflow,
} from 'lucide-react';
import TechCard from '@/components/ui/tech-card';
import ImmersiveExperience from '@/components/ImmersiveExperience';
import type { ImmersiveConfig } from '@/components/ImmersiveExperience';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import { WHATSAPP } from '@/lib/site';

interface Service {
  icon: LucideIcon;
  title: string;
  desc: string;
  details: string;
  group: 'dev' | 'qa';
  /** Card de destaque dentro do grupo (recebe acento amarelo). */
  featured?: boolean;
  /** Selo curto ao lado do ícone (ex.: "Novo") — só quando fizer sentido. */
  badge?: string;
  /** Se presente, o card abre a experiência imersiva (vídeo no scroll) em vez do modal. */
  immersive?: ImmersiveConfig;
  /** Se presente, o modal ganha um link pra página dedicada do serviço. */
  pageHref?: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe,
    title: 'Sites & Plataformas Web',
    group: 'dev',
    featured: true,
    badge: 'Novo',
    desc: 'Sites institucionais, landing pages e sistemas web — dinâmicos ou estáticos — do design ao deploy: rápidos, responsivos e prontos pra converter.',
    details: 'Seu site é a primeira impressão — e muitas vezes a mais decisiva. Construímos desde landing pages enxutas de alta conversão até portais dinâmicos e sistemas web completos, com código limpo, performance de verdade (Core Web Vitals no verde) e responsividade impecável em qualquer tela. Cuidamos de tudo ponta a ponta: design, desenvolvimento, SEO técnico e deploy. E, por nascer dentro da TACONTUDO, cada entrega já sai testada e blindada — qualidade e segurança não são etapa final, são fundação.',
    immersive: {
      label: 'Sites & Plataformas Web',
      frameBase: '/immersive/sites/frame-',
      mobileFrameBase: '/immersive/sites/mobile-frame-',
      frameCount: 159,
      framePad: 3,
      frameExt: 'webp',
      startFrame: 18,
      version: 8,
      ctaLead: 'Quer um site assim pra sua marca?',
      chapters: [
        {
          eyebrow: '01 — Estrutura',
          title: 'Do rascunho ao deploy',
          desc: 'Da arquitetura ao primeiro pixel: montamos a estrutura do seu site com código limpo e pensado pra escalar.',
        },
        {
          eyebrow: '02 — Design',
          title: 'Design que converte',
          desc: 'Interfaces que materializam a sua marca — rápidas, responsivas e desenhadas pra transformar visita em cliente.',
        },
        {
          eyebrow: '03 — Blindagem',
          title: 'Testado e blindado por padrão',
          desc: 'Cada entrega nasce dentro da TACONTUDO: testada, segura e em conformidade. Qualidade e segurança não são etapa final, são fundação.',
        },
      ],
    },
  },
  {
    icon: Workflow,
    title: 'Automação de Processos (RPA)',
    group: 'dev',
    featured: true,
    pageHref: '/rpa/',
    desc: 'Robôs de software que executam as tarefas repetitivas da sua operação — digitação, conciliações, relatórios, integrações — com a régua de teste e segurança da TACONTUDO.',
    details: 'Toda operação tem horas escondidas em trabalho repetitivo: dados digitados de um sistema para outro, planilhas conciliadas à mão, relatórios montados no fim do mês. Mapeamos esses processos e entregamos robôs de RPA que os executam em fração do tempo — de dia, de noite, com cada passo registrado em log. E tratamos bot como o que ele realmente é: software crítico, com acesso direto aos seus dados e sistemas. Por isso, todo robô que sai da TACONTUDO passa por testes antes de entrar em produção, roda com credenciais protegidas em cofre e nasce em conformidade com a LGPD. Automatizar sem essa camada não elimina o risco operacional — só o acelera.'
  },
  {
    icon: Smartphone,
    title: 'Aplicativos Mobile & Web',
    group: 'dev',
    desc: 'Apps mobile (iOS/Android), PWAs e aplicações web sob medida, com a mesma régua de qualidade e segurança do primeiro commit ao deploy.',
    details: 'Transformamos a sua ideia em um produto digital que as pessoas usam todos os dias. Desenvolvemos aplicativos mobile nativos e multiplataforma, PWAs e web apps robustos, sempre pensando na jornada real do usuário (UX/UI) e na solidez do que roda por baixo. Arquitetura escalável, integrações com os serviços que você já usa e segurança aplicada desde a primeira linha de código — para que o seu app cresça sem sustos e sem retrabalho.'
  },
  {
    icon: Blocks,
    title: 'Software & Plataformas sob medida',
    group: 'dev',
    desc: 'Plataformas, integrações, APIs e automações que conversam com os sistemas que você já usa — arquitetura pensada pra escalar.',
    details: 'Quando o sistema de prateleira não dá conta, a gente constrói o que o seu negócio realmente precisa. Desenvolvemos plataformas sob medida, APIs, integrações entre sistemas e automações que eliminam trabalho manual e gargalos invisíveis. Pensamos a arquitetura para escalar desde o início e entregamos com a inspeção de código, os testes automatizados e o compliance que já são marca registrada da TACONTUDO — software que nasce confiável e fácil de manter.'
  },
  {
    icon: Code2,
    title: 'Inspeção de Código',
    group: 'qa',
    desc: 'Análise profunda e sistemática do seu código-fonte, unindo revisão manual especializada e ferramentas automatizadas de última geração.',
    details: 'Na realidade do seu projeto, nossa inspeção de código vai muito além de rodar linters. Fazemos um deep dive minucioso na arquitetura, buscando code smells, gargalos de performance invisíveis e anti-patterns de segurança. O resultado é a garantia de que sua base de código seja escalável, sustentável e fácil de dar manutenção no futuro, economizando meses de refatoração dolorosa.'
  },
  {
    icon: FileSearch,
    title: 'Laudo Pericial de Qualidade',
    group: 'qa',
    desc: 'Avaliação técnica independente e imparcial (Technical Due Diligence): auditoria completa, riscos, débito técnico e estimativas de custo.',
    details: 'Muitas vezes, a verdadeira saúde de um software está escondida. Nosso laudo entrega um raio-X completo através de uma Technical Due Diligence imparcial. Mapeamos ponta a ponta seus débitos técnicos, medimos a complexidade ciclomática e criamos relatórios precisos com estimativas reais de custo e esforço para corrigir problemas estruturais que poderiam, eventualmente, colapsar sua operação.'
  },
  {
    icon: Bot,
    title: 'Automação de Testes',
    group: 'qa',
    desc: 'Estratégias de automação inteligente: testes de API, end-to-end, performance e integração contínua dentro do seu CI/CD.',
    details: 'Velocidade e segurança precisam andar lado a lado. Implementamos pipelines inteligentes que testam o coração do seu software a cada novo commit. Desde validações vitais nas suas APIs até testes end-to-end (E2E) que simulam a jornada real do usuário. Com a nossa automação atrelada ao seu CI/CD, sua equipe poderá realizar múltiplos deploys em produção diariamente com total tranquilidade e zero regressões.'
  },
  {
    icon: ClipboardCheck,
    title: 'Sistema web, Micro serviços e Mobile',
    group: 'qa',
    desc: 'Abordagem metódica ponta a ponta: exploratórios, usabilidade, compatibilidade, segurança, integração e regressão.',
    details: 'O olhar humano afiado e experiente é insubstituível. Nossos engenheiros de QA têm a missão de quebrar o sistema antes que seu cliente o faça. Realizamos testes exploratórios severos focando na experiência de uso (UX/UI), cenários extremos e edge-cases, tanto na interface gráfica (web e mobile) quanto na lógica obscura de regras de negócio e bancos de dados do back-end.'
  },
  {
    icon: ScrollText,
    title: 'Compliance & Auditoria',
    group: 'qa',
    desc: 'Conformidade com LGPD, ISO 27001/27002 e PCI DSS. Gap analysis, políticas e preparação para auditoria externa.',
    details: 'O seu ecossistema lida com dados que valem ouro e informações estritamente confidenciais. Preparamos toda a sua infraestrutura técnica e processos organizacionais para estarem em conformidade incontestável com a LGPD e normativas internacionais (ISO 27001/27002 e PCI DSS). Realizamos um gap analysis brutal para fechar brechas antes de qualquer grande auditoria externa bater na sua porta.'
  },
  {
    icon: ShieldCheck,
    title: 'Cyber Security & DevSecOps',
    group: 'qa',
    desc: 'Segurança aplicada em todo o ciclo — do shift-left ao shift-right — prevenindo brechas regulatórias, financeiras e de imagem.',
    details: 'Cybersegurança não é um adendo, é a fundação de todo o negócio tecnológico moderno. Inserimos as práticas de segurança desde a primeira linha de código (shift-left). Prevenimos e mitigamos ataques de injeção, vazamento de credenciais e as mais complexas vulnerabilidades do OWASP Top 10, garantindo que o seu produto seja blindado e a confiança do seu cliente jamais seja comprometida.'
  },
];

export default function Services() {
  const [selected, setSelected] = useState<Service | null>(null);
  const [immersive, setImmersive] = useState<ImmersiveConfig | null>(null);

  // Travar o scroll do body quando o modal estiver aberto
  useEffect(() => {
    if (!selected) {
      document.body.style.overflow = '';
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selected]);

  const openService = (service: Service) => {
    if (service.immersive) setImmersive(service.immersive);
    else setSelected(service);
  };

  const renderCard = (service: Service) => {
    const { icon: Icon, title, desc, featured, badge } = service;
    return (
      <TechCard
        key={title}
        onClick={() => openService(service)}
        aria-label={`Explorar serviço: ${title}`}
        className="p-7"
      >
        <div className="mb-5 flex items-center gap-3">
          <span
            className={
              featured
                ? 'inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-yellow transition-colors group-hover:bg-brand-yellow group-hover:text-ink'
                : 'inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue/15 text-brand-blue transition-colors group-hover:bg-brand-blue group-hover:text-white'
            }
          >
            <Icon className="h-6 w-6" />
          </span>
          {badge && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow/15 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-brand-yellow">
              <Sparkles className="h-3 w-3" />
              {badge}
            </span>
          )}
        </div>
        <h3 className="mb-2 font-display text-lg font-semibold transition-colors group-hover:text-brand-yellow group-focus-visible:text-brand-yellow">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-justify text-white/70 transition-colors group-hover:text-white/90 group-focus-visible:text-white/90">
          {desc}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-semibold text-brand-yellow">
          Explorar serviço
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden="true" />
        </span>
      </TechCard>
    );
  };

  const devServices = SERVICES.filter((s) => s.group === 'dev');
  const qaServices = SERVICES.filter((s) => s.group === 'qa');

  return (
    <section id="servicos" className="border-t border-white/10 bg-ink px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <AnimatedContainer>
            <p className="mb-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Serviços e soluções
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Construímos, testamos e blindamos o seu software"
            stagger={0.02}
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-4 text-white/70">
              Do desenvolvimento à garantia de qualidade: cada linha de código, cada
              funcionalidade e cada interação atende aos mais altos padrões de
              qualidade, segurança e performance.
            </p>
          </AnimatedContainer>
        </div>

        {/* Grupo — Desenvolvimento */}
        <AnimatedContainer className="mb-5 flex items-center gap-4">
          <h3 className="font-display text-xl font-bold tracking-tight">
            Desenvolvimento de software
          </h3>
          <span className="h-px flex-1 bg-white/10" />
        </AnimatedContainer>
        <AnimatedContainer delay={0.15}>
          <p className="mb-8 max-w-2xl text-sm text-white/65">
            Tiramos a sua ideia do papel — sites, apps e plataformas construídos com a
            régua de qualidade e segurança da TACONTUDO desde a primeira linha de código.
          </p>
        </AnimatedContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {devServices.map(renderCard)}
        </div>

        {/* Grupo — Qualidade & Segurança */}
        <AnimatedContainer className="mb-5 mt-16 flex items-center gap-4">
          <h3 className="font-display text-xl font-bold tracking-tight">
            Qualidade &amp; Segurança
          </h3>
          <span className="h-px flex-1 bg-white/10" />
        </AnimatedContainer>
        <AnimatedContainer delay={0.15}>
          <p className="mb-8 max-w-2xl text-sm text-white/65">
            A base da casa desde 2020: testamos, auditamos e blindamos o seu software
            para que ele chegue ao mercado confiável e em conformidade.
          </p>
        </AnimatedContainer>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {qaServices.map(renderCard)}
        </div>
      </div>

      {/* Modal Pop-up */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
          <button
            type="button"
            aria-label="Fechar detalhes do serviço"
            className="absolute inset-0 cursor-default bg-ink/80 backdrop-blur-sm transition-opacity"
            onClick={() => setSelected(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            aria-describedby="service-modal-description"
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-brand-blue/30 bg-ink-soft p-1 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Glow / Tech effect no modal */}
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-brand-blue/30 blur-[80px]" />
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-brand-yellow/20 blur-[80px]" />
            
            <div className="relative bg-ink rounded-[14px] p-6 sm:p-10">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label={`Fechar detalhes de ${selected.title}`}
                className="absolute right-4 top-4 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
              
              <div className="mb-6 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/20 text-brand-yellow ring-1 ring-brand-blue/40">
                  <selected.icon className="h-7 w-7" />
                </span>
                <h3 id="service-modal-title" className="font-display text-2xl font-bold text-white">
                  {selected.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-base font-medium leading-relaxed text-justify text-brand-blue">
                  {selected.desc}
                </p>
                <div className="h-px w-full bg-gradient-to-r from-brand-blue/50 to-transparent" />
                <p id="service-modal-description" className="text-sm sm:text-base leading-relaxed text-justify text-white/80">
                  {selected.details}
                </p>
              </div>
              
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full bg-white/10 px-6 py-2.5 font-display text-sm font-semibold text-white transition-colors hover:bg-brand-blue hover:text-white"
                >
                  Entendi
                </button>
                {selected.pageHref && (
                  <a
                    href={selected.pageHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-yellow/50 px-6 py-2.5 font-display text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow hover:text-ink"
                  >
                    Página do serviço
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 py-2.5 font-display text-sm font-semibold text-ink transition-transform hover:scale-105"
                >
                  Solicitar consultoria
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Experiência imersiva (vídeo no scroll) — cards de destaque */}
      {immersive && (
        <ImmersiveExperience config={immersive} onClose={() => setImmersive(null)} />
      )}
    </section>
  );
}
