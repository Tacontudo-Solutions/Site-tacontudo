import { useEffect, useState } from 'react';

/**
 * true a partir do breakpoint `md` do Tailwind (>= 768px). Usado pra desligar
 * efeitos pesados (deck pinado, filtros animados no scroll) no mobile, onde
 * eles engasgam. Inicializa já com o valor certo (SPA, `window` existe) pra
 * evitar flash de layout.
 */
export function useIsDesktop(minWidth = 768) {
  const query = `(min-width: ${minWidth}px)`;
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);

  return isDesktop;
}
