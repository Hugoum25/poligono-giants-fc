/* ==========================================
   FC HUB - VISTA ZONA FAN (CAMISETA 3D)
   ========================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { ClubLogo } from './ClubLogo.js';
import { SponsorJaviFrey } from './SponsorJaviFrey.js';

export const FanZoneView = {
    render() {
        const isRotated = state.jerseyRotated ? 'transform: rotateY(180deg);' : '';
        
        return `
            <div class="container" style="padding-top:40px; padding-bottom:80px;">
                <h2 class="section-title">
                    Personalizador de Camiseta
                </h2>
                
                <div class="fan-zone-grid">
                    <!-- Personalizador 3D de Camiseta (Lado Izquierdo) -->
                    <div class="jersey-canvas-container">
                        <div class="jersey-3d" id="interactive-jersey" style="${isRotated}">
                            <!-- FRENTE DE LA CAMISETA -->
                            <div class="jersey-side jersey-front">
                                <div class="jersey-stripe-container">
                                    <div class="jersey-stripe"></div>
                                    <div class="jersey-stripe"></div>
                                    <div class="jersey-stripe"></div>
                                    <div class="jersey-stripe"></div>
                                </div>
                                <div class="jersey-badge">${ClubLogo.render(40)}</div>
                                <div class="jersey-sponsor" style="margin-top:12px;">
                                    ${SponsorJaviFrey.render(30)}
                                </div>
                                <div style="position:absolute; bottom:14px; font-size:0.7rem; font-family:var(--font-mono); color:#000000; font-weight:800; text-transform:uppercase; z-index:3;">
                                    FRENTE
                                </div>
                            </div>
                            
                            <!-- ESPALDA DE LA CAMISETA ROSA -->
                            <div class="jersey-side jersey-back">
                                <div class="jersey-stripe-container" style="opacity: 0.15;">
                                    <div class="jersey-stripe"></div>
                                    <div class="jersey-stripe"></div>
                                    <div class="jersey-stripe"></div>
                                </div>
                                <div class="jersey-name-display" id="jersey-name-text">${state.jerseyName}</div>
                                <div class="jersey-number-display" id="jersey-number-text">${state.jerseyNumber}</div>
                                <div style="position:absolute; bottom:14px; font-size:0.7rem; font-family:var(--font-mono); color:#000000; font-weight:800; text-transform:uppercase; z-index:3;">
                                    ESPALDA
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Controles de Edición (Lado Derecho) -->
                    <div class="glass-card customizer-card">
                        <h3>Personaliza tu Camiseta</h3>
                        <p style="color:var(--text-muted); margin-bottom:24px; font-size:0.95rem;">
                            Escribe tu nombre y dorsal preferido para ver el diseño en tiempo real sobre la camiseta oficial de ${teamData.clubName}.
                        </p>
                        
                        <div class="form-group">
                            <label for="input-jersey-name">Nombre en Camiseta</label>
                            <input type="text" 
                                   id="input-jersey-name" 
                                   class="form-input" 
                                   maxlength="12" 
                                   value="${state.jerseyName}" 
                                   placeholder="Ej: TU APELLIDO">
                        </div>

                        <div class="form-group">
                            <label for="input-jersey-number">Número (Dorsal)</label>
                            <input type="number" 
                                   id="input-jersey-number" 
                                   class="form-input" 
                                   min="1" 
                                   max="99" 
                                   value="${state.jerseyNumber}" 
                                   placeholder="Ej: 10">
                        </div>

                        <div style="display:flex; flex-direction:column; gap:12px; margin-top:32px;">
                            <button class="btn btn-primary" id="btn-rotate-jersey">
                                🔄 Girar Camiseta
                            </button>
                            <button class="btn btn-secondary" id="btn-simulate-order">
                                🛒 Simular Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        const jersey = document.getElementById('interactive-jersey');
        const btnRotate = document.getElementById('btn-rotate-jersey');
        const btnOrder = document.getElementById('btn-simulate-order');
        
        const inputName = document.getElementById('input-jersey-name');
        const inputNumber = document.getElementById('input-jersey-number');
        
        const textName = document.getElementById('jersey-name-text');
        const textNumber = document.getElementById('jersey-number-text');

        // Rotación 3D de la camiseta
        if (btnRotate && jersey) {
            btnRotate.addEventListener('click', () => {
                const isCurrentlyRotated = state.jerseyRotated;
                const nextRotateState = !isCurrentlyRotated;
                
                state.jerseyRotated = nextRotateState; // Actualizar localmente sin render total
                
                if (nextRotateState) {
                    jersey.style.transform = 'rotateY(180deg)';
                } else {
                    jersey.style.transform = 'rotateY(0deg)';
                }
            });
        }

        // Actualización en tiempo real del nombre (sin re-renderizar todo el DOM para mantener foco)
        if (inputName && textName) {
            inputName.addEventListener('input', (e) => {
                let nameValue = e.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
                inputName.value = nameValue;
                textName.innerText = nameValue || "CENTELLA";
                state.jerseyName = nameValue || "CENTELLA"; // guardar en estado sin notificar a todos
                
                // Rotar automáticamente al dorso al escribir
                if (!state.jerseyRotated && jersey) {
                    state.jerseyRotated = true;
                    jersey.style.transform = 'rotateY(180deg)';
                }
            });
        }

        // Actualización en tiempo real del número
        if (inputNumber && textNumber) {
            inputNumber.addEventListener('input', (e) => {
                let numValue = parseInt(e.target.value);
                if (isNaN(numValue) || numValue < 1) numValue = '';
                if (numValue > 99) numValue = 99;
                
                inputNumber.value = numValue;
                textNumber.innerText = numValue !== '' ? numValue : "10";
                state.jerseyNumber = numValue !== '' ? numValue : "10"; // guardar en estado
                
                // Rotar automáticamente al dorso al escribir
                if (!state.jerseyRotated && jersey) {
                    state.jerseyRotated = true;
                    jersey.style.transform = 'rotateY(180deg)';
                }
            });
        }

        // Simulación de pedido
        if (btnOrder) {
            btnOrder.addEventListener('click', () => {
                const name = state.jerseyName || "CENTELLA";
                const num = state.jerseyNumber || "10";
                
                alert(`🛒 ¡Pedido Simulado! Ha añadido al carrito: Camiseta de local de ${teamData.clubName} personalizada con el nombre "${name}" y el dorsal "${num}".`);
            });
        }
    }
};
