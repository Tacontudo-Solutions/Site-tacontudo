import type { ReactNode } from 'react';

/**
 * Anel metálico animado em volta de um CTA pill — CSS puro (.metal-ring em
 * index.css): o botão filho fica 100% intacto (amarelo vivo) e o anel é um
 * conic-gradient dourado girando na faixa de 3px ao redor.
 *
 * Substitui a integração com o metal-fx: o canvas dele compositava por cima
 * do botão e dessaturava o amarelo da marca. Aqui o efeito fica ATRÁS do
 * filho, então nada toca a cor do botão.
 */
export default function MetalButton({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`metal-ring ${className}`}>
      {children}
    </span>
  );
}
