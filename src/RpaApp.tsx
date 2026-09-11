import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Navbar from '@/components/Navbar';
import RpaHero from '@/components/rpa/RpaHero';
import RpaProblema from '@/components/rpa/RpaProblema';
import RpaDefinicao from '@/components/rpa/RpaDefinicao';
import RpaNumeros from '@/components/rpa/RpaNumeros';
import RpaProcesso from '@/components/rpa/RpaProcesso';
import RpaVideo from '@/components/rpa/RpaVideo';
import RpaCTA from '@/components/rpa/RpaCTA';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { RevealText } from '@/components/ui/reveal-text';

function RpaApp() {
  // Splash de abertura: mesmo ritual de marca da home e da /nossa-estrutura/.
  const [carregando, setCarregando] = useState(true);

  // Trava o scroll enquanto o splash está na tela
  useEffect(() => {
    document.body.style.overflow = carregando ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [carregando]);

  return (
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
        <RpaHero textReady={!carregando} />
        <RpaProblema />
        <RpaDefinicao />
        <RpaNumeros />
        <RpaProcesso />
        <RpaVideo />
        <RpaCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  );
}

export default RpaApp;
