import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface TechCardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  children: ReactNode;
  /** Classes utilitárias aplicadas ao corpo (padding, etc.). */
  className?: string;
}

/**
 * Card com estética tecnológica na paleta TACONTUDO: um ponto de luz que
 * percorre a borda, segmentos que brilham nos cantos e um feixe difuso ("ray")
 * sobre a superfície escura. Estilos em `index.css` (prefixo `.tech-card`).
 *
 * Adaptado do componente "moving dot card" para envolver conteúdo arbitrário
 * (ícone + título + descrição) em vez do contador de views original.
 */
export default function TechCard({ children, className = '', type = 'button', ...buttonProps }: TechCardProps) {
  return (
    <button type={type} {...buttonProps} className="tech-card group w-full">
      <div className="tech-card__content">
        <span className="tech-card__ray" aria-hidden="true" />
        <span className="tech-card__line tech-card__line--top" aria-hidden="true" />
        <span className="tech-card__line tech-card__line--right" aria-hidden="true" />
        <span className="tech-card__line tech-card__line--bottom" aria-hidden="true" />
        <span className="tech-card__line tech-card__line--left" aria-hidden="true" />
        <div className={`tech-card__body ${className}`}>{children}</div>
      </div>
    </button>
  );
}
