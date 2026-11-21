/* ==========================================================
   UI — registro de canales y helpers de marcado compartidos
   ========================================================== */

import { I } from './Icons.js';

/** Parrilla de canales: una única fuente para Navbar, Home, OSD y guía. */
export const CHANNELS = [
    { id: 'home',       ch: '00', label: 'Inicio',            short: 'Inicio' },
    { id: 'news',       ch: '01', label: 'Noticias',          short: 'Noticias' },
    { id: 'squad',      ch: '02', label: 'Plantilla',         short: 'Plantilla' },
    { id: 'matches',    ch: '03', label: 'Temporada',         short: 'Temporada' },
    { id: 'sponsors',   ch: '04', label: 'Patrocinadores',    short: 'Sponsors' },
    { id: 'multimedia', ch: '05', label: 'Media',             short: 'Media' },
    { id: 'lineup',     ch: '06', label: 'Generador IG',      short: 'IG',       admin: true },
    { id: 'games',      ch: '07', label: 'Juegos',            short: 'Juegos',   admin: true },
    { id: 'palmares',   ch: '08', label: 'Historia del Club', short: 'Historia', admin: true }
];

const ALIASES = { alineacion: 'lineup', juegos: 'games', fanzone: 'palmares' };

export function getChannel(pageId) {
    const id = ALIASES[pageId] || pageId;
    return CHANNELS.find(c => c.id === id) || CHANNELS[0];
}

/** Cabecera de sección tipo rótulo de emisión. */
export function LowerThird({ page, title, sub = '', actions = '' }) {
    const ch = getChannel(page);
    return `
        <header class="pg-lt">
            <div class="pg-lt__tag">
                <span class="pg-lt__ch">CH ${ch.ch}</span>
                <span class="pg-lt__kicker">Polígono Giants TV</span>
            </div>
            <div>
                <h1 class="pg-lt__title">${title || ch.label}</h1>
                ${sub ? `<p class="pg-lt__sub">${sub}</p>` : ''}
            </div>
            ${actions ? `<div class="pg-lt__actions">${actions}</div>` : ''}
        </header>
    `;
}

/** Cabecera de modal coherente. */
export function ModalHead({ kicker = '', title = '', closeId = '' }) {
    return `
        <div class="pg-modal__head">
            <div>
                ${kicker ? `<div class="pg-modal__kicker">${kicker}</div>` : ''}
                <h3 class="pg-modal__title">${title}</h3>
            </div>
            ${closeId ? `<button type="button" class="pg-close" id="${closeId}" aria-label="Cerrar">${I('close')}</button>` : ''}
        </div>
    `;
}

/** Iniciales para escudos/avatares sin imagen. */
export function initials(name = '') {
    const words = String(name).replace(/[^\p{L}\p{N}\s-]/gu, '').split(/[\s-]+/).filter(Boolean);
    if (!words.length) return '—';
    if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
}

/** Escudo rival (imagen) o caja con iniciales. size: '' | 'sm' | 'lg' | 'xl' */
export function Crest(src, name, size = '') {
    const mod = size ? ` pg-crest--${size}` : '';
    if (src) return `<img src="${src}" alt="${name || ''}" class="pg-crest${mod}" loading="lazy" />`;
    return `<span class="pg-crest-fallback${mod}" aria-label="${name || ''}">${initials(name)}</span>`;
}

/** Quita emojis de etiquetas heredadas (roleLabel, etc.). */
export function stripEmoji(str = '') {
    return String(str).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '').trim();
}

/** Logos de patrocinadores: sustituye a los 8 componentes Sponsor*.js. */
const SPONSOR_LOGOS = {
    isJaviFrey:    'javi-frey-logo.png',
    isMambaShaved: 'mambashaved-logo.png',
    isBambi:       'bambi-logo.png',
    isLaBase:      'labase-tattoo-logo.png',
    isTrmSports:   'trm-sports-logo.png',
    isSohoBar:     'soho-bar-logo.png',
    isPastur:      'pastur-logo.png',
    isFitmaster:   'fitmaster-logo.png'
};

export function sponsorLogoSrc(sp = {}) {
    if (sp.image) return sp.image;
    const flag = Object.keys(SPONSOR_LOGOS).find(k => sp[k]);
    return flag ? `./src/assets/sponsors/${SPONSOR_LOGOS[flag]}` : '';
}

export function SponsorLogo(sp, cls = 'pg-sponsor-logo') {
    const src = sponsorLogoSrc(sp);
    if (src) return `<img src="${src}" alt="${sp.name}" class="${cls} pg-logo-auto" loading="lazy" draggable="false" />`;
    return `<span class="${cls} pg-sponsor-logo--text">${sp.name}</span>`;
}

/**
 * Logos con fondo opaco (blanco o negro) → se marcan para fundirlos con la pantalla.
 * Lee el píxel de esquina en un canvas diminuto (mismo origen).
 */
const logoCache = new Map();
export function tuneLogos(root = document) {
    root.querySelectorAll('img.pg-logo-auto:not([data-tuned])').forEach(img => {
        const apply = () => {
            img.dataset.tuned = '1';
            let kind = logoCache.get(img.src);
            if (kind === undefined) {
                kind = '';
                try {
                    const c = document.createElement('canvas');
                    c.width = c.height = 16;
                    const ctx = c.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(img, 0, 0, 16, 16);
                    const corners = [[0, 0], [15, 0], [0, 15], [15, 15]].map(([x, y]) => ctx.getImageData(x, y, 1, 1).data);
                    const opaque = corners.every(d => d[3] > 220);
                    const lum = corners.reduce((a, d) => a + (d[0] * 0.299 + d[1] * 0.587 + d[2] * 0.114), 0) / 4;
                    if (opaque && lum > 200) kind = 'is-light-bg';
                    else if (opaque && lum < 50) kind = 'is-dark-bg';
                } catch (e) { /* canvas contaminado: se deja tal cual */ }
                logoCache.set(img.src, kind);
            }
            if (kind) img.classList.add(kind);
        };
        if (img.complete && img.naturalWidth) apply();
        else img.addEventListener('load', apply, { once: true });
    });
}
