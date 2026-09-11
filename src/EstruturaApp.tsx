import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import EstruturaHero from '@/components/estrutura/EstruturaHero';
import Manifesto from '@/components/estrutura/Manifesto';
import Departamentos from '@/components/estrutura/Departamentos';
import Interlude from '@/components/estrutura/Interlude';
import EstruturaCTA from '@/components/estrutura/EstruturaCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { RevealText } from '@/components/ui/reveal-text';

function EstruturaApp() {
  // Splash de carregamento: "TACONTUDO" letra a letra + varredura amarela.
  // A página já monta por baixo (a foto da hero carrega escondida); quando o
  // splash sai (fade), o motion da tipografia da hero dispara.
  const [carregando, setCarregando] = useState(true);

  // Trava o scroll enquanto o splash está na tela
  useEffect(() => {
    document.body.style.overflow = carregando ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [carregando]);

  return (
    // reducedMotion="user": animações do motion viram fade/none pra quem
    // pede menos movimento no sistema — acessibilidade sem código extra.
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {carregando && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink px-6"
          >
            <RevealText
              text="TACONTUDO"
              fontSize="text-4xl sm:text-6xl md:text-8xl"
              onComplete={() => setCarregando(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      <main>
        <EstruturaHero textReady={!carregando} />
        <Manifesto />
        <Departamentos />
        <Interlude />
        <EstruturaCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  );
}

export default EstruturaApp;
