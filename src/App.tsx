import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { RevealText } from '@/components/ui/reveal-text';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import RpaCallout from '@/components/RpaCallout';
import Platform from '@/components/Platform';
import VideoIntro from '@/components/VideoIntro';
import Differentiators from '@/components/Differentiators';
import StructureCallout from '@/components/StructureCallout';
import Certifications from '@/components/Certifications';
import Clients from '@/components/Clients';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

function App() {
  // Splash de abertura: "TACONTUDO" letra a letra + varredura amarela (mesmo
  // efeito da /nossa-estrutura/). A home monta por baixo (o WebGL da hero
  // carrega escondido); quando o splash sai, a tipografia da hero dispara.
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
        <Hero textReady={!carregando} />
        <Services />
        <RpaCallout />
        <Platform />
        <VideoIntro />
        <Differentiators />
        <StructureCallout />
        <Certifications />
        <Clients />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </MotionConfig>
  );
}

export default App;
