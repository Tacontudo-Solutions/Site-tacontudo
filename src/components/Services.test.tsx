import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Services from './Services';

beforeAll(() => {
  class IO {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }
  Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: IO });
  Object.defineProperty(globalThis, 'IntersectionObserver', { writable: true, value: IO });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
});

describe('Services', () => {
  it('renders the featured and standard service cards', () => {
    render(<Services />);
    expect(
      screen.getByRole('button', { name: /Explorar serviço: Sites & Plataformas Web/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Explorar serviço: Inspeção de Código/i }),
    ).toBeInTheDocument();
  });

  it('opens the details modal for a standard service and closes on Escape', () => {
    render(<Services />);
    fireEvent.click(
      screen.getByRole('button', { name: /Explorar serviço: Inspeção de Código/i }),
    );
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Inspeção de Código')).toBeInTheDocument();
    expect(within(dialog).getByText(/Solicitar consultoria/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the details modal for the RPA card and closes on Escape', () => {
    render(<Services />);
    fireEvent.click(
      screen.getByRole('button', { name: /Explorar serviço: Automação de Processos \(RPA\)/i }),
    );
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Automação de Processos (RPA)')).toBeInTheDocument();
    expect(within(dialog).getByText(/credenciais protegidas em cofre/i)).toBeInTheDocument();
    expect(
      within(dialog).getByRole('link', { name: /Página do serviço/i }),
    ).toHaveAttribute('href', '/rpa/');

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the immersive experience for the featured card and closes on Escape', () => {
    render(<Services />);
    fireEvent.click(
      screen.getByRole('button', { name: /Explorar serviço: Sites & Plataformas Web/i }),
    );
    // Desktop scrub layout shows the preloader while frames "load"
    // (they never load in jsdom, which is fine — we only assert it opened).
    expect(screen.getByText(/Preparando experiência/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText(/Preparando experiência/i)).not.toBeInTheDocument();
  });
});
