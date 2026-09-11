import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { WHATSAPP, TAGLINE } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import MetalButton from '@/components/ui/metal-button';

export default function EstruturaCTA() {
  return (
    <section className="border-t border-white/10 bg-ink px-6 py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <TextStagger
          text="Uma estrutura séria por trás de cada entrega."
          stagger={0.02}
          className="font-display text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl"
        />
        <AnimatedContainer delay={0.25} className="mt-5 max-w-xl">
          <p className="text-white/60">
            Quando você contrata a TACONTUDO, contrata uma operação completa — técnica,
            jurídica e financeiramente preparada pra sustentar o seu projeto do primeiro
            contato à satisfação pós-entrega.
          </p>
        </AnimatedContainer>
        <AnimatedContainer delay={0.45} className="mt-10">
          <MetalButton>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 font-display font-semibold text-ink"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Solicitar Consultoria
            </a>
          </MetalButton>
        </AnimatedContainer>
        <AnimatedContainer delay={0.6} className="mt-10">
          <p className="font-display text-sm italic text-white/40">{TAGLINE}</p>
        </AnimatedContainer>
      </div>
    </section>
  );
}
