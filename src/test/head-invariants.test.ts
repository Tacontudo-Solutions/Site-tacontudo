import { describe, it, expect } from 'vitest';
// Vite `?raw` imports (typed via vite/client) — keeps this test inside the
// browser-only tsconfig boundary (no node:fs / @types/node needed).
import indexHtml from '../../index.html?raw';
import estruturaHtml from '../../nossa-estrutura/index.html?raw';
import rpaHtml from '../../rpa/index.html?raw';
import blogHtml from '../../blog/index.html?raw';
import privacidadeHtml from '../../politica-de-privacidade/index.html?raw';
import cookiesHtml from '../../politica-de-cookies/index.html?raw';

const PAGES: [string, string][] = [
  ['index.html', indexHtml],
  ['nossa-estrutura/index.html', estruturaHtml],
  ['rpa/index.html', rpaHtml],
  ['blog/index.html', blogHtml],
  ['politica-de-privacidade/index.html', privacidadeHtml],
  ['politica-de-cookies/index.html', cookiesHtml],
];

describe('production <head> invariants', () => {
  it.each(PAGES)('%s contains no ephemeral tunnel host', (_page, html) => {
    expect(html).not.toContain('trycloudflare');
  });

  it.each(PAGES)('%s declares a tacontudo.com canonical', (_page, html) => {
    expect(html).toMatch(/rel="canonical"[^>]+href="https:\/\/tacontudo\.com/);
  });

  it('homepage exposes Organization structured data', () => {
    expect(indexHtml).toContain('application/ld+json');
    expect(indexHtml).toMatch(/"@type":\s*"Organization"/);
  });

  it('homepage og:url points to tacontudo.com', () => {
    expect(indexHtml).toMatch(
      /property="og:url"\s+content="https:\/\/tacontudo\.com\//,
    );
  });
});
