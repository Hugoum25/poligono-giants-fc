/* ==========================================
   FC HUB - CONTROLADOR DE ENRUTADO Y TV
   ========================================== */

import { state } from './state.js';
import { TvShell } from './components/TvShell.js';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { HomeView } from './components/HomeView.js';
import { NewsView } from './components/NewsView.js';
import { SquadView } from './components/SquadView.js';
import { LineupView } from './components/LineupView.js';
import { MatchesView } from './components/MatchesView.js';
import { SponsorsView } from './components/SponsorsView.js';
import { MultimediaView } from './components/MultimediaView.js';
import { PalmaresView } from './components/PalmaresView.js';
import { GamesView } from './components/GamesView.js';
import { Obj3DViewer } from './components/Obj3DViewer.js';

// Catálogo de vistas internas
const routes = {
    home: HomeView,
    news: NewsView,
    squad: SquadView,
    lineup: LineupView,
    alineacion: LineupView,
    matches: MatchesView,
    sponsors: SponsorsView,
    multimedia: MultimediaView,
    games: GamesView,
    juegos: GamesView,
    palmares: PalmaresView,
    fanzone: PalmaresView
};

let currentView = null;

function renderApp() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // 1. Asegurar que la estructura de la TV (TvShell) esté renderizada en el documento
    if (!appContainer.querySelector('.tv-wrapper')) {
        appContainer.innerHTML = TvShell.render();
        TvShell.bindEvents();
    }

    const tvScreen = document.getElementById('main-tv-screen');
    const screenContent = document.getElementById('tv-screen-content');
    const ledIndicator = document.getElementById('tv-power-led');

    if (!tvScreen || !screenContent || !ledIndicator) return;

    // 2. Gestionar el encendido/apagado físico y CRT
    if (!state.powerOn) {
        // Apagar la TV
        tvScreen.classList.remove('screen-on');
        tvScreen.classList.add('screen-off');
        
        ledIndicator.classList.remove('led-on');
        ledIndicator.classList.add('led-off');

        // Detener procesos activos en la vista actual
        if (currentView && typeof currentView.destroy === 'function') {
            currentView.destroy();
        }
        currentView = null;
        screenContent.innerHTML = '';
        return;
    }

    // Encender la TV
    tvScreen.classList.remove('screen-off');
    tvScreen.classList.add('screen-on');
    
    ledIndicator.classList.remove('led-off');
    ledIndicator.classList.add('led-on');

    // 3. Resolver la vista activa en el canal seleccionado
    const viewComponent = routes[state.activePage] || HomeView;

    // Destruir recursos de la vista saliente si cambia
    if (currentView && currentView !== viewComponent && typeof currentView.destroy === 'function') {
        currentView.destroy();
    }
    currentView = viewComponent;

    // Guardar la posición de scroll actual antes del re-renderizado
    const currentScrollTop = tvScreen.scrollTop;

    // 4. Inyectar Navbar, Contenido y Footer dentro de la pantalla
    screenContent.innerHTML = `
        ${Navbar.render()}
        <div style="flex-grow: 1;">
            ${viewComponent.render()}
        </div>
        ${Footer.render()}
    `;

    // 5. Vincular gestores de eventos tras actualizar el DOM
    Navbar.bindEvents();
    viewComponent.bindEvents();
    Footer.bindEvents();

    // 6. Inicializar visores 3D de modelos .OBJ
    Obj3DViewer.initAll();

    // 7. Restaurar la posición de scroll exacta (Evita saltos arriba al abrir modal)
    tvScreen.scrollTop = currentScrollTop;

    // 8. Posicionar cualquier modal activo exactamente en el área de pantalla visible actual
    const activeModals = screenContent.querySelectorAll('.modal-overlay.active');
    activeModals.forEach(modal => {
        const viewHeight = tvScreen.clientHeight || window.innerHeight;
        modal.style.position = 'absolute';
        modal.style.top = currentScrollTop + 'px';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = viewHeight + 'px';
        modal.style.zIndex = '999999';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.opacity = '1';
        modal.style.pointerEvents = 'all';

        const card = modal.querySelector('.glass-card, .player-modal, .video-player-modal');
        if (card) {
            card.style.margin = 'auto';
            card.style.maxHeight = '85vh';
            card.style.overflowY = 'auto';
            card.style.webkitOverflowScrolling = 'touch';
        }
    });

    // 9. Bloquear 100% el scroll de fondo aplicando clase de bloqueo y fijando la posición
    const hasModal = activeModals.length > 0;
    document.body.classList.toggle('modal-open', hasModal);
    tvScreen.classList.toggle('modal-locked', hasModal);

    if (hasModal) {
        tvScreen.onscroll = () => {
            tvScreen.scrollTop = currentScrollTop;
        };
    } else {
        tvScreen.onscroll = null;
    }
}

// Interceptor global en window para prevenir que cualquier gesto touchmove/wheel se pase a la pantalla de fondo
function preventBackgroundScroll(e) {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (!activeModal) return;

    const card = activeModal.querySelector('.glass-card, .player-modal, .video-player-modal');
    if (!card || !card.contains(e.target)) {
        if (e.cancelable) e.preventDefault();
    }
}

window.addEventListener('touchmove', preventBackgroundScroll, { passive: false });
window.addEventListener('wheel', preventBackgroundScroll, { passive: false });

// Inicializar la aplicación
function initApp() {
    state.subscribe(renderApp);
    renderApp();
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}


