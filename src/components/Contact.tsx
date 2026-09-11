import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import MagicCard from '@/components/ui/magic-card';
import { WHATSAPP, PHONE_DISPLAY, ADDRESS, HOURS } from '@/lib/site';
import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';
import MetalButton from '@/components/ui/metal-button';

const INFO = [
  { icon: Phone, title: 'Telefone / WhatsApp', value: PHONE_DISPLAY },
  { icon: MapPin, title: 'Localização', value: ADDRESS },
  { icon: Clock, title: 'Horário', value: HOURS },
];

export default function Contact() {
  return (
    <section id="contato" className="relative isolate overflow-hidden border-t border-white/10 bg-ink px-6 py-24">
      {/* Fundo decorativo dark abstrato (gerado por IA). Some sozinho se não existir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.45]"
        style={{ backgroundImage: 'url(/contact-bg.webp)' }}
      />
      {/* Véu suave nas bordas; centro liberado pro escudo (zona escura = texto legível) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/60 via-ink/5 to-ink/60"
      />
      <div className="mx-auto max-w-4xl text-center">
        <TextStagger
          text="Vamos conversar sobre como elevar a qualidade do seu software"
          stagger={0.015}
          className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
        />

        <AnimatedContainer delay={0.25} className="mt-10 flex justify-center">
          <MetalButton>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 font-display font-semibold text-ink"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Falar agora no WhatsApp
              <ArrowRight className="h-4 w-4" />
            </a>
          </MetalButton>
        </AnimatedContainer>

        <div className="relative mt-16">
          {/* brilhos que acendem o vidro (backdrop-blur) */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="absolute left-[8%] top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-brand-blue/30 blur-3xl" />
            <div className="absolute right-[10%] top-0 h-40 w-40 rounded-full bg-brand-yellow/15 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-44 w-64 -translate-x-1/2 rounded-full bg-brand-blue/20 blur-3xl" />
          </div>

          <div className="relative grid gap-6 sm:grid-cols-3">
            {INFO.map(({ icon: Icon, title, value }) => (
              <MagicCard key={title} className="text-center">
                <span className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-blue/15 text-brand-blue ring-1 ring-brand-blue/25">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-1 font-display text-sm font-semibold text-white/85">{title}</h3>
                <p className="text-sm text-white/60">{value}</p>
              </MagicCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
