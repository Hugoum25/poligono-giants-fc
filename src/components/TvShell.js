/* ==========================================
   FC HUB - COMPONENTE TV CABINET SHELL (SIN MANDO)
   ========================================== */

import { state } from '../state.js';

export const TvShell = {
    render() {
        const ledClass = state.powerOn ? 'led-on' : 'led-off';
        const screenStateClass = state.powerOn ? 'screen-on' : 'screen-off';
        
        return `
            <div class="tv-wrapper">
                <!-- Marco del Televisor -->
                <div class="tv-bezel">
                    <!-- Pantalla de TV -->
                    <div class="tv-screen ${screenStateClass}" id="main-tv-screen">
                        <div class="tv-glass-overlay"></div>
                        
                        <!-- Contenedor del Sistema de Navegación y Vistas -->
                        <div class="tv-content-container" id="tv-screen-content">
                            <!-- Rendered dynamically by main.js -->
                        </div>
                    </div>

                    <!-- Barra Inferior del Bezel -->
                    <div class="tv-bezel-bottom">
                        <div class="tv-speakers">
                            <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                        </div>
                        
                        <div class="tv-brand-label">POLÍGONO GIANTS TV</div>
                        
                        <div class="tv-controls-panel">
                            <!-- LED de encendido -->
                            <div class="tv-led-indicator ${ledClass}" id="tv-power-led"></div>
                            
                            <!-- Botón Power -->
                            <button class="tv-physical-btn tv-power-btn" id="tv-physical-power" title="Encendido/Apagado">
                                ⏻
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const togglePower = () => {
            state.update({ powerOn: !state.powerOn });
        };

        const physicalPower = document.getElementById('tv-physical-power');
        if (physicalPower) physicalPower.addEventListener('click', togglePower);
    }
};
