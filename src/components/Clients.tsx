import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { CLIENTS, CLIENT_LOGOS, WHATSAPP } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/** Ajuste óptico por logo: marcas com muito respiro interno ficam pequenas na
 *  mesma altura dos demais. `scale` não conflita com as classes de altura. */
const LOGO_SCALE: Record<string, string> = {
  'C&A': 'scale-[1.4]',
  'GINGAPAY': 'scale-[1.3]',
  'SAIPOS': 'scale-[1.3]',
  'MadeiraMadeira': 'scale-[1.5]',
  'Monte Bravo': 'scale-[2]',
  'Banco Genial': 'scale-[2]',
  'CPF Seguros': 'scale-[2]',
  'CredSis': 'scale-[2]',
};

export default function Clients() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink-soft px-6 py-24">
      {/* Fundo decorativo: textura dark abstrata (gerada por IA) pra dar profundidade. */}
      <img
        src="/clients-bg.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-center opacity-50"
      />
      {/* Véu suave só nas bordas (topo/base) pra leitura; meio liberado pros nós */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-soft/60 via-ink-soft/5 to-ink-soft/60"
      />
      <div className="mx-auto max-w-7xl">
        {/* Faixa de CTA */}
        <div className="relative mb-20 overflow-hidden rounded-3xl bg-brand-blue px-8 py-12 sm:px-14">
          <img src="/cta-bg-new.webp" alt="" aria-hidden="true"
               className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-brand-blue/20" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/15 to-ink/70" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <TextStagger
              text="Proporcione uma experiência confiável e livre de bugs aos seus usuários."
              stagger={0.015}
              className="max-w-xl font-display text-2xl font-bold leading-snug text-white sm:text-3xl"
            />
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-display font-semibold text-brand-blue transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Pedir orçamento
            </a>
          </div>
        </div>

        {/* Logo wall */}
        <div className="text-center">
          <TextStagger
            text="Experiência com grandes empresas, transformando confiança em resultados"
            stagger={0.015}
            className="mx-auto mb-3 max-w-2xl font-display text-2xl font-bold tracking-tight sm:text-3xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mb-12 text-white/55">Confiança construída ao longo de anos de parceria.</p>
          </AnimatedContainer>

          {/* Carrossel infinito: lista duplicada pro loop emendar (animação anda -50%).
              Padding por item (não gap) pra o ponto de emenda cair exato. */}
          <div className="marquee-mask overflow-hidden">
            <ul className="marquee items-center py-2">
              {[...CLIENTS, ...CLIENTS].map((name, i) => {
                const logoUrl = CLIENT_LOGOS[name];
                return (
                  <li
                    key={`${name}-${i}`}
                    aria-hidden={i >= CLIENTS.length}
                    className="flex shrink-0 items-center px-8 sm:px-10"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={name}
                        className={`h-8 w-auto object-contain opacity-55 brightness-0 invert transition-all hover:opacity-100 sm:h-10 ${LOGO_SCALE[name] ?? ''}`}
                      />
                    ) : (
                      <span className="font-display text-xl font-bold tracking-tight text-white/55 transition-colors hover:text-white sm:text-2xl">
                        {name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
