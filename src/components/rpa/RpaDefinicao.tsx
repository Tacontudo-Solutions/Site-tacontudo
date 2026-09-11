import { TextStagger, AnimatedContainer } from '@/components/ui/hero-animated';

/** O que é RPA, em uma frase — sem jargão, com os mitos derrubados ao lado. */
export default function RpaDefinicao() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-ink-soft px-6 py-24">
      {/* Fundo decorativo blueprint — some sozinho se o asset não existir */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.35]"
        style={{ backgroundImage: 'url(/sobre-bg.webp)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink-soft/80 via-ink-soft/30 to-transparent"
      />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <TextStagger
            text="O funcionário digital que não pede férias"
            stagger={0.02}
            className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
          />
          <AnimatedContainer delay={0.2}>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              RPA é software que faz no computador o que uma pessoa faria — abre
              sistema, copia, preenche, confere e move dado entre telas. Só que
              em fração do tempo, a qualquer hora, com cada passo registrado.
            </p>
          </AnimatedContainer>
        </div>

        <AnimatedContainer direction="right" delay={0.3}>
          <div className="rounded-2xl border border-white/10 bg-ink/60 p-7 backdrop-blur-sm">
            <p className="mb-5 font-display text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              O que RPA não é
            </p>
            <ul className="space-y-4 text-sm leading-relaxed text-white/75">
              <li className="flex gap-3">
                <span className="mt-0.5 font-display font-bold text-white/30 line-through">robô físico</span>
                <span>— é software; roda nos sistemas que você já usa.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-display font-bold text-white/30 line-through">IA que decide</span>
                <span>— segue a regra que você definiu; não improvisa sozinho.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 font-display font-bold text-white/30 line-through">demissão em massa</span>
                <span>— assume a parte que não exige pensar; libera o time pro resto.</span>
              </li>
            </ul>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm text-white/60">
                <span className="font-semibold text-white/90">Em 2026, o próximo passo:</span> RPA + IA
                (hiperautomação) — robôs que também tratam a exceção, não só a rotina.
              </p>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </section>
  );
}
