import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

vi.mock('@/components/ui/glsl-hills', () => ({
  GLSLHills: () => <div data-testid="glsl-hills">GLSL Hills Mock</div>
}));

// lottie-web usa canvas na inicialização do módulo — jsdom não tem canvas
vi.mock('lottie-web', () => ({
  default: {
    loadAnimation: () => ({ destroy: () => {}, setDirection: () => {}, play: () => {} }),
  },
}));

// jsdom não implementa IntersectionObserver (usado por Platform e reveals de scroll)
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

// jsdom não implementa matchMedia (usado por Platform, EstruturaHero, etc.)
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

describe('App Component', () => {
  it('renders successfully', async () => {
    render(<App />);

    // O splash de abertura ("TACONTUDO" + varredura) roda ~2s antes do
    // conteúdo da hero montar — os finds aguardam ele completar.
    const ctas = await screen.findAllByText(/Falar no WhatsApp/i, {}, { timeout: 8000 });
    expect(ctas.length).toBeGreaterThan(0);

    expect(
      await screen.findByText(/Empresas que confiam na TACONTUDO/i, {}, { timeout: 8000 }),
    ).toBeInTheDocument();
  }, 15000);
});
