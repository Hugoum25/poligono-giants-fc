/* ==========================================================
   ICON 3D — objetos .OBJ girando para los canales (estilo AWGE)
   ========================================================== */

import { state } from '../state.js';

const OBJ_BY_CHANNEL = {
    multimedia: 'media-icon.obj',
    squad:      'noticias-icon.obj',
    news:       'plantilla-icon.obj',
    matches:    'partidos-icon.obj',
    sponsors:   'patrocinadores-icon.obj',
    games:      'juegos-icon.obj'
};

const ALIASES = {
    '📸': 'multimedia', media: 'multimedia', video: 'multimedia',
    '🏃': 'squad', plantilla: 'squad', jugadores: 'squad',
    '📰': 'news', noticias: 'news',
    '⚽': 'matches', partidos: 'matches',
    '🤝': 'sponsors', patrocinadores: 'sponsors',
    '🎮': 'games', juegos: 'games'
};

function sizeFor(size) {
    const w = window.innerWidth || 1280;
    if (size === 'lg') return w < 520 ? 180 : 240;
    if (size === 'md') return w < 400 ? 120 : w < 720 ? 140 : w < 1280 ? 170 : 210;
    return w < 520 ? 72 : 96;
}

export const Icon3D = {
    render(symbol, size = 'sm', extraOptions = {}) {
        const px = sizeFor(size);
        const key = OBJ_BY_CHANNEL[symbol] ? symbol : (ALIASES[symbol] || 'multimedia');
        const objPath = `./src/assets/icons/${OBJ_BY_CHANNEL[key] || OBJ_BY_CHANNEL.multimedia}`;

        const isHome = state.activePage === 'home';
        const speed = extraOptions.speed !== undefined ? extraOptions.speed : (isHome ? 0.016 : 0);

        return `
            <span class="obj-3d-canvas-container"
                  data-obj-path="${objPath}"
                  data-width="${px}"
                  data-height="${px}"
                  data-rotate-speed="${speed}"
                  data-rotate-axis="y"
                  style="width:${px}px;height:${px}px"></span>
        `;
    }
};
