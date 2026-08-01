/* ==========================================
   FC HUB - ÍCONOS FIGURAS 3D Y ESTÁTICOS UNIFORMES
   ========================================== */

import { ClubLogo } from './ClubLogo.js';
import { state } from '../state.js';

export const Icon3D = {
    /**
     * Genera un ícono 3D rotatorio (.OBJ) para los 6 canales de la portada
     * todos girando en el eje Y en la misma dirección y exactos a la misma velocidad.
     */
    render(symbol, size = 'sm', extraOptions = {}) {
        const pxDim = size === 'lg' ? 240 : size === 'md' ? 180 : 120;

        const isMultimedia = (symbol === '📸' || symbol === 'multimedia' || symbol === 'media' || symbol === 'video');
        const isSquad = (symbol === '🏃' || symbol === 'squad' || symbol === 'plantilla' || symbol === 'jugadores');
        const isNews = (symbol === '📰' || symbol === 'news' || symbol === 'noticias');
        const isMatches = (symbol === '⚽' || symbol === 'matches' || symbol === 'partidos');
        const isSponsors = (symbol === '🤝' || symbol === 'sponsors' || symbol === 'patrocinadores');
        const isGames = (symbol === '🎮' || symbol === 'games' || symbol === 'juegos');

        // Los íconos rotan en inicio a la misma velocidad uniforme (0.02 rad/frame)
        const isHome = state.activePage === 'home';
        const speedVal = extraOptions.speed !== undefined ? extraOptions.speed : (isHome ? 0.02 : 0);

        let objPath = './src/assets/media-icon.obj';
        if (isMultimedia) objPath = './src/assets/media-icon.obj';
        else if (isSquad) objPath = './src/assets/noticias-icon.obj';
        else if (isNews) objPath = './src/assets/plantilla-icon.obj';
        else if (isMatches) objPath = './src/assets/partidos-icon.obj';
        else if (isSponsors) objPath = './src/assets/patrocinadores-icon.obj';
        else if (isGames) objPath = './src/assets/juegos-icon.obj';

        return `
            <div class="obj-3d-canvas-container" 
                 data-obj-path="${objPath}" 
                 data-width="${pxDim}" 
                 data-height="${pxDim}" 
                 data-rotate-speed="${speedVal}"
                 data-rotate-axis="y"
                 style="width:${pxDim}px; height:${pxDim}px; display:inline-block; vertical-align:middle; filter:drop-shadow(0 0 10px rgba(var(--club-primary-rgb),0.85));">
            </div>
        `;
    }
};
