/* ==========================================
   FC HUB - VISTA DE ESTADÍSTICAS (STATS)
   ========================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';

export const StatsView = {
    render() {
        // Ordenar goleadores (Top 3)
        const scorers = [...teamData.players]
            .filter(p => p.stats.goals !== undefined)
            .sort((a, b) => b.stats.goals - a.stats.goals)
            .slice(0, 3);

        const scorersHtml = scorers.map((p, idx) => {
            const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border-bottom:1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:1.3rem;">${rankMedal}</span>
                        <div>
                            <strong style="display:block;">${p.name}</strong>
                            <span style="font-size:0.8rem; color:var(--text-muted);">${p.position} (#${p.number})</span>
                        </div>
                    </div>
                    <div style="font-family:var(--font-heading); font-weight:700; font-size:1.4rem; color:var(--club-primary);">
                        ${p.stats.goals} Goles
                    </div>
                </div>
            `;
        }).join('');

        // Ordenar asistidores (Top 3)
        const assisters = [...teamData.players]
            .filter(p => p.stats.assists !== undefined)
            .sort((a, b) => b.stats.assists - a.stats.assists)
            .slice(0, 3);

        const assistersHtml = assisters.map((p, idx) => {
            const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:16px; border-bottom:1px solid var(--border-color);">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="font-size:1.3rem;">${rankMedal}</span>
                        <div>
                            <strong style="display:block;">${p.name}</strong>
                            <span style="font-size:0.8rem; color:var(--text-muted);">${p.position} (#${p.number})</span>
                        </div>
                    </div>
                    <div style="font-family:var(--font-heading); font-weight:700; font-size:1.4rem; color:var(--club-secondary);">
                        ${p.stats.assists} Asist.
                    </div>
                </div>
            `;
        }).join('');

        // Estadísticas generales del equipo (Valores de ejemplo)
        const teamPerformanceStats = [
            { label: "Posesión de Balón Media", value: "62%", fillWidth: "62%" },
            { label: "Efectividad de Pase", value: "88%", fillWidth: "88%" },
            { label: "Goles por Partido (Promedio)", value: "2.3", fillWidth: "76%" },
            { label: "Remates a Puerta (Promedio)", value: "14.5", fillWidth: "72%" }
        ];

        const teamStatsRowsHtml = teamPerformanceStats.map(stat => `
            <div class="progress-row">
                <div class="progress-label-row">
                    <span style="font-weight:500;">${stat.label}</span>
                    <strong style="color:var(--club-primary);">${stat.value}</strong>
                </div>
                <div class="progress-track">
                    <div class="progress-fill" data-width="${stat.fillWidth}"></div>
                </div>
            </div>
        `).join('');

        // Cálculo de rendimiento global (Ej: 72 pts de 93 posibles en 31 partidos = 77%)
        const maxPoints = 31 * 3;
        const currentPoints = 72; // de standings
        const performancePercentage = Math.round((currentPoints / maxPoints) * 100);

        return `
            <div class="container" style="padding-top:40px; padding-bottom:80px;">
                <h2 class="section-title">Estadísticas del Club</h2>
                
                <div class="stats-container-grid">
                    <!-- Rendimiento de Equipo e Indicador Circular -->
                    <div style="display:flex; flex-direction:column; gap:32px;">
                        <!-- Rendimiento de juego -->
                        <div class="glass-card chart-card">
                            <h3>Estilo de Juego</h3>
                            <div class="progress-bar-list">
                                ${teamStatsRowsHtml}
                            </div>
                        </div>

                        <!-- Indicador circular SVG -->
                        <div class="glass-card chart-card" style="text-align:center;">
                            <h3>Rendimiento en Liga</h3>
                            <div class="stats-circle-container">
                                <div>
                                    <svg viewBox="0 0 36 36" class="circular-chart">
                                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path class="circle animate-circle" 
                                              data-stroke-dash="${performancePercentage}"
                                              stroke-dasharray="0, 100" 
                                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <text x="18" y="20.35" class="circle-text">${performancePercentage}%</text>
                                    </svg>
                                    <span style="display:block; margin-top:16px; font-size:0.95rem; color:var(--text-muted);">
                                        Puntos Obtenidos (${currentPoints} de ${maxPoints})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Líderes del Equipo (Goleadores y Asistidores) -->
                    <div style="display:flex; flex-direction:column; gap:32px;">
                        <!-- Goleadores -->
                        <div class="glass-card">
                            <h3 style="padding:24px 24px 12px 24px; border-bottom:1px solid var(--border-color); font-size:1.3rem;">
                                ⚽ Máximos Goleadores
                            </h3>
                            <div>
                                ${scorersHtml}
                            </div>
                        </div>

                        <!-- Asistidores -->
                        <div class="glass-card">
                            <h3 style="padding:24px 24px 12px 24px; border-bottom:1px solid var(--border-color); font-size:1.3rem;">
                                🪄 Líderes de Asistencias
                            </h3>
                            <div>
                                ${assistersHtml}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Animar barras de progreso horizontales
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(fill => {
                const width = fill.getAttribute('data-width');
                fill.style.width = width;
            });
        }, 100);

        // Animar círculos de progreso SVG
        setTimeout(() => {
            const circle = document.querySelector('.animate-circle');
            if (circle) {
                const targetPercentage = circle.getAttribute('data-stroke-dash');
                circle.setAttribute('stroke-dasharray', `${targetPercentage}, 100`);
            }
        }, 100);
    }
};
