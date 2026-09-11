export const PHONE_DISPLAY = '(11) 98894-1799';
export const PHONE_INTL = '5511988941799';

export const WHATSAPP =
  `https://wa.me/${PHONE_INTL}?text=` +
  encodeURIComponent('Olá! Vim pelo site da TACONTUDO e gostaria de um orçamento.');

/** CTA da página /rpa/ — mensagem pré-preenchida contextual ao serviço. */
export const WHATSAPP_RPA =
  `https://wa.me/${PHONE_INTL}?text=` +
  encodeURIComponent('Olá! Vim pela página de RPA e quero automatizar um processo da minha operação.');

export const INSTAGRAM = 'https://www.instagram.com/tacontudo.solutions';
export const QADORO_URL = 'https://www.qadoro.com.br/index.html';
export const ADDRESS = 'Rua Orense, 41 – Sala 805, Centro, Diadema – SP – CEP 09920-650';
export const HOURS = 'Segunda a sexta, 9h às 18h';

export const TAGLINE = 'Com qualidade e segurança não se brinca.';

export const CLIENTS = [
  'C&A',
  'Unidas',
  'Veloe',
  'Alelo',
  'Tua Agenda',
  'GOL',
  'Travelex Confidence',
  'Too Seguros',
  'Adiq',
  'Banco Topázio',
  'Natura',
  'EMS',
  'MB',
  'Sicredi',
  'FISERV',
  'GINGAPAY',
  'CRDC',
  'ASAPTECH',
  'SAIPOS',
  'MadeiraMadeira',
  'Monte Bravo',
  'Banco Genial',
  'CPF Seguros',
  'CredSis',
];

/**
 * Logos reais (viram silhueta branca via `brightness-0 invert` no Clients.tsx).
 * Só funcionam imagens com FUNDO TRANSPARENTE (SVG ou PNG/WebP com alpha) — só a
 * forma (alpha) importa, a cor é descartada pelo filtro.
 * Marcas fora do mapa caem como texto branco — fallback limpo até termos o logo oficial.
 * TODO: trocar por SVG oficial (logo dentro de badge colorido não converte limpo):
 *       Alelo, Tua Agenda, Travelex Confidence, Banco Topázio, EMS e MB.
 */
export const CLIENT_LOGOS: Record<string, string> = {
  'C&A': '/logos/cea.webp',
  Unidas: '/logos/unidas.webp',
  Veloe: '/logos/veloe.webp',
  GOL: '/logos/gol.webp',
  'Too Seguros': '/logos/tooseguros.webp',
  Adiq: '/logos/adiq.webp',
  Natura: '/logos/natura.webp',
  'Banco Topázio': '/logos/bancotopazio.webp',
  'Travelex Confidence': '/logos/travelex.webp',
  'Tua Agenda': '/logos/tuaagenda.webp',
  EMS: '/logos/ems.webp',
  MB: '/logos/mb.webp',
  Alelo: '/logos/alelo.webp',
  Sicredi: '/logos/sicredi.webp',
  FISERV: '/logos/fiserv.webp',
  GINGAPAY: '/logos/gingapay.webp',
  CRDC: '/logos/crdc.webp',
  ASAPTECH: '/logos/asaptech.webp',
  SAIPOS: '/logos/saipos.webp',
  MadeiraMadeira: '/logos/madeiramadeira.webp',
  'Monte Bravo': '/logos/montebravo.webp',
  'Banco Genial': '/logos/bancogenial.webp',
  'CPF Seguros': '/logos/cpfseguros.webp',
  CredSis: '/logos/credisis.webp',
};

// Âncoras com "/" na frente pra funcionarem também a partir das outras
// páginas (ex: /nossa-estrutura/); na home o comportamento não muda.
export const NAV = [
  { label: 'Serviços', href: '/#servicos' },
  { label: 'RPA', href: '/rpa/' },
  { label: 'Plataforma', href: '/#plataforma' },
  { label: 'A TACONTUDO', href: '/#sobre' },
  { label: 'Diferenciais', href: '/#diferenciais' },
  { label: 'Nossa Estrutura', href: '/nossa-estrutura/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Contato', href: '/#contato' },
];
