import { useState } from 'react';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

interface CertItem {
  id: string;
  name: string;
  category: string;
  description: string;
  link: string;
  orbit: 'inner' | 'outer';
  angle: number; // Ângulo em radianos para posicionamento orbital
}

const LOGO_SCALE: Record<string, string> = {
  'iso27001': 'scale-[1.4]',
  'itil': 'scale-[1.4]',
};

const CERTIFICATIONS: CertItem[] = [
  // Órbita Interna (QA & Testes)
  {
    id: 'tmmi',
    name: 'TMMi',
    category: 'Qualidade & Testes (QA)',
    description: 'Valida a excelência, a maturidade internacional e a robustez dos nossos processos de testes de software. Essa certificação garante metodologias consistentes para entregas com um índice de bugs drasticamente menor, elevando o nível de qualidade.',
    link: 'https://www.tmmi.org/',
    orbit: 'inner',
    angle: -Math.PI / 2, // -90 deg (Topo)
  },
  {
    id: 'istqb',
    name: 'ISTQB',
    category: 'Qualidade & Testes (QA)',
    description: 'Comprova as competências técnicas, a especialização avançada e o total alinhamento do nosso time com as melhores práticas de engenharia de QA do mundo, garantindo testes precisos e baseados em padrões globais amplamente reconhecidos.',
    link: 'https://www.istqb.org/',
    orbit: 'inner',
    angle: (-Math.PI / 2) + (2 * Math.PI / 3), // 30 deg
  },
  {
    id: 'cbts',
    name: 'CBTS',
    category: 'Qualidade & Testes (QA)',
    description: 'Certificação de Teste de Software de grande abrangência nacional, garantindo rigorosa conformidade e validação sistemática de processos segundo as exigências específicas e os mais elevados padrões técnicos do mercado brasileiro de tecnologia.',
    link: 'https://www.bstqb.org.br/',
    orbit: 'inner',
    angle: (-Math.PI / 2) + (4 * Math.PI / 3), // 150 deg
  },
  // Órbita Externa (Segurança & Governança)
  {
    id: 'iso27002',
    name: 'ISO 27002',
    category: 'Segurança & Compliance',
    description: 'Estabelece diretrizes internacionais e controles rigorosos de segurança da informação, assegurando a blindagem de dados sensíveis e o gerenciamento de acessos em todo o nosso ecossistema, minimizando vulnerabilidades e riscos corporativos.',
    link: 'https://www.iso.org/standard/75652.html',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7, // Defasado para evitar colisão visual no topo
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    category: 'Segurança & Compliance',
    description: 'Reconhecido padrão global para Sistemas de Gestão de Segurança da Informação (SGSI), assegurando continuamente os mais altos níveis de confidencialidade, integridade, conformidade estrutural e total disponibilidade dos dados dos nossos clientes.',
    link: 'https://www.iso.org/standard/27001',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (2 * Math.PI / 7),
  },
  {
    id: 'lgpd',
    name: 'LGPD',
    category: 'Segurança & Compliance',
    description: 'Garante nossa conformidade integral e contínua com a Lei Geral de Proteção de Dados, assegurando a adoção de arquiteturas de privacidade nativa (Privacy by Design) e a manipulação ética, transparente e segura de todas as informações sensíveis.',
    link: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (4 * Math.PI / 7),
  },
  {
    id: 'pcidss',
    name: 'PCI-DSS',
    category: 'Segurança & Compliance',
    description: 'Assegura a blindagem total e a conformidade regulatória nas transações financeiras, estabelecendo um ambiente de alta proteção para pagamentos eletrônicos, e-commerce e processamento seguro de dados de cartões contra fraudes e interceptações.',
    link: 'https://www.pcisecuritystandards.org/',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (6 * Math.PI / 7),
  },
  {
    id: 'itil',
    name: 'ITIL',
    category: 'Governança & Gestão de TI',
    description: 'Consolida a evolução do principal framework de gerenciamento de serviços de TI, integrando práticas ágeis inovadoras, metodologias DevOps e iniciativas de transformação digital contínua para alinhar estrategicamente a tecnologia ao valor real de negócio.',
    link: 'https://www.axelos.com/certifications/itil-service-management',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (8 * Math.PI / 7),
  },
  {
    id: 'ethicalhack',
    name: 'Ethical Hacker',
    category: 'Segurança & Compliance',
    description: 'Certificação profissional de hacker ético que atesta e valida habilidades avançadas em testes de invasão (pentest), detecção proativa de vulnerabilidades críticas e implementação de modernas técnicas de defesa cibernética ativa e preventiva.',
    link: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (10 * Math.PI / 7),
  },
  {
    id: 'cobit',
    name: 'COBIT',
    category: 'Governança & Gestão de TI',
    description: 'Adoção do framework líder de mercado focado inteiramente na governança corporativa de TI, alinhando estrategicamente o rigoroso controle de riscos, o mapeamento de processos auditáveis e a máxima estabilidade e confiabilidade de todas as entregas.',
    link: 'https://www.isaca.org/credentialing/cobit',
    orbit: 'outer',
    angle: -Math.PI / 2 + Math.PI / 7 + (12 * Math.PI / 7),
  },
];

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<CertItem | null>(null);
  const [activeTab, setActiveTab] = useState<'qa' | 'security'>('qa');
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({});

  const handleSectionClick = (e: React.MouseEvent) => {
    // Deseleciona a certificação se o clique for no vazio (não for em links/botões)
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) {
      return;
    }
    setActiveCert(null);
  };

  // Dimensões do layout orbital (Desktop)
  const innerRadius = 180;
  const outerRadius = 280;

  return (
    <section
      id="certificacoes"
      className="relative overflow-hidden border-t border-white/10 px-6 py-12 md:py-16"
      onClick={handleSectionClick}
    >
      {/* Imagem de Fundo solicitada pelo usuário */}
      <img
        src="/rodadecertificacoes.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      {/* Background decorativo sutil (brilho) */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Cabeçalho da Seção */}
        <div className="mb-14 md:mb-16 text-center md:text-left">
          <AnimatedContainer>
            <p className="mb-2.5 font-display text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              Padrões & Conformidade
            </p>
          </AnimatedContainer>
          <TextStagger
            text="Nossas Certificações"
            stagger={0.02}
            className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-3.5 max-w-2xl text-sm text-white/70">
              Garantimos a excelência operacional, a segurança da informação e a maturidade de processos
              por meio de padrões validados internacionalmente.
            </p>
          </AnimatedContainer>
        </div>

        {/* Layout Split: Órbita (Esquerda) + Painel de Informações (Direita) */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">

          {/* Coluna de Texto (Direita no Desktop, Inferior no Mobile) */}
          <div className="flex flex-col justify-center min-h-[300px] md:min-h-[420px] w-full max-w-[380px] mx-auto md:mx-0 md:ml-auto rounded-2xl border border-white/10 bg-ink-soft/40 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden order-2 md:order-2">
            {/* Efeitos de luz no painel */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brand-blue/10 blur-[60px]" />
            <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-brand-yellow/10 blur-[60px]" />

            <div className="relative z-10">
              {activeCert ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                  <span className="inline-flex rounded-full bg-brand-blue/10 border border-brand-blue/20 px-3 py-1 font-display text-xs font-semibold text-brand-blue uppercase tracking-wide mb-4">
                    {activeCert.category}
                  </span>
                  <h3 className="font-display text-3xl font-extrabold text-white mb-4">
                    {activeCert.name}
                  </h3>
                  <p className="text-base leading-relaxed text-white/70 text-justify">
                    {activeCert.description}
                  </p>
                  <a
                    href={activeCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-8 font-display text-sm font-semibold text-brand-yellow hover:underline"
                  >
                    Visitar site da certificação &rarr;
                  </a>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <span className="inline-flex rounded-full bg-white/5 border border-white/10 px-3 py-1 font-display text-xs font-semibold text-white/70 uppercase tracking-wide mb-4">
                    Padrões e Governança
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mb-4">
                    Excelência Homologada
                  </h3>
                  <p className="text-base leading-relaxed text-white/70 text-justify">
                    Nosso time opera sob rigorosas metodologias e padrões globais de governança corporativa em TI. Passe o mouse ou toque nos selos de certificação acima para explorar de forma detalhada o impacto direto e conferir os links oficiais de cada uma das normativas, diretrizes e certificações que moldam profundamente a nossa cultura técnica.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sistema Orbital (Esquerda no Desktop, Superior no Mobile) */}
          <div className="flex flex-col justify-center items-center md:-mt-16 md:-mr-4 order-1 md:order-1">

            {/* Visualização de Órbita - Apenas no Desktop / Telas Médias (md+) */}
            <div className="hidden md:relative md:flex md:w-[680px] md:h-[680px] md:items-center md:justify-center group">

              {/* Linhas Concêntricas das Órbitas */}
              <div
                className="absolute rounded-full border border-white/5 pointer-events-none"
                style={{ width: `${innerRadius * 2}px`, height: `${innerRadius * 2}px` }}
              />
              <div
                className="absolute rounded-full border border-white/5 pointer-events-none"
                style={{ width: `${outerRadius * 2}px`, height: `${outerRadius * 2}px` }}
              />

              {/* Círculo Central: Marca estática, sem dependência de WebGL */}
              <div className="absolute z-20 flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-ink shadow-2xl shadow-brand-blue/15 transition-transform duration-300 hover:scale-105">
                <img
                  src="/logo-mark.webp"
                  alt="TACONTUDO"
                  className="h-28 w-28 object-contain drop-shadow-[0_0_24px_rgba(255,196,0,0.25)]"
                />
              </div>

              {/* Órbita Interna (QA) */}
              <div className="absolute inset-0 orbit-container-inner pointer-events-none">
                {CERTIFICATIONS.filter(c => c.orbit === 'inner').map((cert) => {
                  const radius = innerRadius;
                  const x = Math.cos(cert.angle) * radius;
                  const y = Math.sin(cert.angle) * radius;
                  const isActive = activeCert?.id === cert.id;

                  return (
                    <a
                      key={cert.id}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setActiveCert(cert)}
                      style={{
                        left: `calc(50% + ${x}px - 40px)`,
                        top: `calc(50% + ${y}px - 40px)`,
                      }}
                      className={`orbit-item-inner pointer-events-auto absolute z-30 flex h-20 w-20 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-110 overflow-hidden bg-white
                        ${isActive
                          ? 'shadow-[0_0_25px_rgba(71,138,201,0.8)] scale-110'
                          : 'opacity-90 hover:opacity-100'
                        }`}
                    >
                      {!logoErrors[cert.id] ? (
                        <img
                          src={`/logos/certs/${cert.id}.webp`}
                          alt={cert.name}
                          onError={() => setLogoErrors(prev => ({ ...prev, [cert.id]: true }))}
                          className={`h-full w-full object-cover transition-all duration-300 ${LOGO_SCALE[cert.id] || ''}`}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-ink-soft/90 text-white/70">{cert.name}</span>
                      )}
                    </a>
                  );
                })}
              </div>

              {/* Órbita Externa (Security & Gov) */}
              <div className="absolute inset-0 orbit-container-outer pointer-events-none">
                {CERTIFICATIONS.filter(c => c.orbit === 'outer').map((cert) => {
                  const radius = outerRadius;
                  const x = Math.cos(cert.angle) * radius;
                  const y = Math.sin(cert.angle) * radius;
                  const isActive = activeCert?.id === cert.id;

                  return (
                    <a
                      key={cert.id}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setActiveCert(cert)}
                      style={{
                        left: `calc(50% + ${x}px - 40px)`,
                        top: `calc(50% + ${y}px - 40px)`,
                      }}
                      className={`orbit-item-outer pointer-events-auto absolute z-30 flex h-20 w-20 items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 hover:scale-110 overflow-hidden bg-white
                        ${isActive
                          ? 'shadow-[0_0_25px_rgba(255,196,0,0.8)] scale-110'
                          : 'opacity-90 hover:opacity-100'
                        }`}
                    >
                      {!logoErrors[cert.id] ? (
                        <img
                          src={`/logos/certs/${cert.id}.webp`}
                          alt={cert.name}
                          onError={() => setLogoErrors(prev => ({ ...prev, [cert.id]: true }))}
                          className={`h-full w-full object-cover transition-all duration-300 ${LOGO_SCALE[cert.id] || ''}`}
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-ink-soft/90 text-white/70">{cert.name}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Visualização de Órbita Premium - Apenas no Mobile (<md) */}
            <div className="flex flex-col items-center w-full md:hidden">

              {/* Seletor de Categoria (Tabs) */}
              <div className="flex gap-2 p-1 rounded-xl bg-ink-soft/80 border border-white/10 mb-8 w-full max-w-[340px] backdrop-blur-sm">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('qa');
                    setActiveCert(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-display tracking-wider transition-all duration-300
                    ${activeTab === 'qa'
                      ? 'bg-brand-blue/10 border border-brand-blue/30 text-brand-blue shadow-lg shadow-brand-blue/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  Qualidade (QA)
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('security');
                    setActiveCert(null);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold font-display tracking-wider transition-all duration-300
                    ${activeTab === 'security'
                      ? 'bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow shadow-lg shadow-brand-yellow/5'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  Segurança & Gov
                </button>
              </div>

              {/* Sistema Orbital Mobile Centralizado */}
              <div className="relative flex w-[290px] h-[290px] items-center justify-center mb-6 group">

                {/* Linha orbital fina */}
                <div className="absolute rounded-full border border-white/5 pointer-events-none w-[200px] h-[200px]" />

              {/* Marca estática centralizada */}
              <div className="absolute z-20 flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-ink shadow-xl shadow-brand-blue/10 transition-transform duration-300">
                <img
                  src="/logo-mark.webp"
                  alt="TACONTUDO"
                  className="h-20 w-20 object-contain drop-shadow-[0_0_18px_rgba(255,196,0,0.22)]"
                />
              </div>

                {/* Selos da Categoria Selecionada */}
                <div className={`absolute inset-0 pointer-events-none ${activeTab === 'qa' ? 'orbit-container-inner' : 'orbit-container-outer'}`}>
                  {(() => {
                    const filteredMobileCerts = CERTIFICATIONS.filter(cert => {
                      return activeTab === 'qa' ? cert.orbit === 'inner' : cert.orbit === 'outer';
                    });

                    return filteredMobileCerts.map((cert, index, arr) => {
                      const total = arr.length;
                      const angle = (-Math.PI / 2) + (index * (2 * Math.PI / total));
                      const radius = 100;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;
                      const isActive = activeCert?.id === cert.id;

                      return (
                        <button
                          key={cert.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCert(cert);
                          }}
                          style={{
                            left: `calc(50% + ${x}px - 28px)`,
                            top: `calc(50% + ${y}px - 28px)`,
                          }}
                          className={`pointer-events-auto absolute z-30 flex h-14 w-14 items-center justify-center rounded-full text-[9px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95
                            ${activeTab === 'qa' ? 'orbit-item-inner' : 'orbit-item-outer'}
                            ${isActive
                              ? cert.category.includes('QA')
                                ? 'shadow-[0_0_20px_rgba(71,138,201,0.7)] scale-110 border border-brand-blue/50 bg-ink-soft/90'
                                : 'shadow-[0_0_20px_rgba(255,196,0,0.7)] scale-110 border border-brand-yellow/50 bg-ink-soft/90'
                              : 'opacity-85 active:opacity-100 border border-white/10 bg-ink-soft/40 backdrop-blur-sm'
                            }`}
                        >
                          {!logoErrors[cert.id] ? (
                            <img
                              src={`/logos/certs/${cert.id}.webp`}
                              alt={cert.name}
                              onError={() => setLogoErrors(prev => ({ ...prev, [cert.id]: true }))}
                              className="h-full w-full object-contain p-1 rounded-full transition-all duration-300"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full border border-white/10 bg-ink-soft/90 text-[10px] text-white/70">{cert.name}</span>
                          )}
                        </button>
                      );
                    });
                  })()}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
