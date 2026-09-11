import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import MetalButton from '@/components/ui/metal-button';
import { WHATSAPP_RPA, TAGLINE } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

export default function RpaCTA() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink px-6 py-28">
      {/* Glow central — foco de luz no convite */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(50% 45% at 50% 50%, rgba(71,138,201,0.16) 0%, rgba(11,18,32,0) 70%)' }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <TextStagger
          text="Comece pelo processo que mais dói"
          stagger={0.02}
          className="font-display text-3xl font-bold tracking-tight sm:text-5xl"
        />
        <AnimatedContainer delay={0.2}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
            Traga um processo repetitivo. A gente devolve as horas.
          </p>
        </AnimatedContainer>

        <AnimatedContainer delay={0.35} className="mt-10 flex justify-center">
          <MetalButton>
            <a
              href={WHATSAPP_RPA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-display text-lg font-semibold text-ink"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </MetalButton>
        </AnimatedContainer>

        <AnimatedContainer delay={0.5} className="mt-10">
          <p className="font-display text-sm text-white/45">
            {TAGLINE.replace('.', '')} — <span className="text-white/70">inclusive com os seus robôs.</span>
          </p>
        </AnimatedContainer>
      </div>
    </section>
  );
}
