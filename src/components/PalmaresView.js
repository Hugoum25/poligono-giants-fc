/* ==========================================
   POLÍGONO GIANTS F7 - VISTA PALMARÉS Y CAMISETAS HISTÓRICAS
   ========================================== */

import { teamData } from '../data/teamData.js';
import { ClubLogo } from './ClubLogo.js';

export const PalmaresView = {
    seasons: [
        {
            year: "2026 / 2027",
            badge: "NUEVA TEMPORADA",
            player: {
                title: "Camiseta de Jugador",
                isUpcoming: true,
                img: null
            },
            gk: {
                title: "Camiseta de Portero",
                isUpcoming: true,
                img: null
            }
        },
        {
            year: "2025 / 2026",
            badge: "2025 / 2026",
            singleJersey: true,
            player: {
                title: "Equipación Blanca",
                isUpcoming: false,
                img: "./src/assets/jersey_white_kit.jpg"
            }
        },
        {
            year: "2024 / 2025",
            badge: "2024 / 2025",
            player: {
                title: "Camiseta de Jugador",
                isUpcoming: false,
                img: "./src/assets/jersey_2024_2025.jpg"
            },
            gk: {
                title: "Camiseta de Portero",
                isUpcoming: false,
                img: "./src/assets/jersey_gk_2024_2025.jpg"
            }
        }
    ],

    trophies: [
        { title: "Campeón de Copa F7 Gijón", year: "2024", desc: "Primer título oficial conquistado tras una épica tanda de penaltis." },
        { title: "Subcampeón de Liga Regular", year: "2025", desc: "Temporada récord de puntos luchando hasta la última jornada." },
        { title: "Trofeo Fair Play & Juego Limpio", year: "2024", desc: "Reconocimiento a la deportividad del club." },
        { title: "Bota de Oro de la Liga (Rodrigo Cuesta #9)", year: "2024", desc: "Máximo goleador absoluto del campeonato con 22 dianas." }
    ],

    render() {
        const trophiesHtml = this.trophies.map(t => `
            <div class="glass-card" style="padding:14px 18px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.02);">
                <div>
                    <div style="font-size:0.7rem; font-family:var(--font-mono); font-weight:700; color:var(--club-primary); text-transform:uppercase;">
                        ${t.year}
                    </div>
                    <h4 style="font-size:0.95rem; font-family:var(--font-heading); margin:2px 0 3px 0; color:var(--text-main);">
                        ${t.title}
                    </h4>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin:0; line-height:1.3;">
                        ${t.desc}
                    </p>
                </div>
            </div>
        `).join('');

        const seasonsHtml = this.seasons.map(s => {
            const renderJersey = (item) => {
                if (item.isUpcoming) {
                    return `
                        <div style="flex:1; text-align:center; padding:14px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                            <span style="font-size:0.78rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading);">
                                ${item.title}
                            </span>
                            <span style="font-size:0.68rem; font-family:var(--font-mono); color:var(--club-primary); margin-top:4px;">(Revelación en Octubre)</span>
                        </div>
                    `;
                }

                return `
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; text-align:center;">
                        <span style="font-size:0.78rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading); margin-bottom:8px;">
                            ${item.title}
                        </span>
                        <img src="${item.img}" alt="${item.title}" style="max-height:270px; width:auto; max-width:100%; object-fit:contain; display:block; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.6));">
                    </div>
                `;
            };

            return `
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:8px; padding:16px 20px; max-width:540px; width:100%; margin:0 auto 24px auto; box-sizing:border-box;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                        <h3 style="font-size:1.2rem; font-family:var(--font-heading); margin:0; color:var(--text-main); font-weight:800;">
                            ${s.year}
                        </h3>
                        ${ClubLogo.render(24)}
                    </div>

                    <div style="display:flex; justify-content:space-around; align-items:flex-start; gap:16px;">
                        ${renderJersey(s.player)}
                        ${s.gk ? renderJersey(s.gk) : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="container" style="padding-top:28px; padding-bottom:60px;">
                <h2 class="section-title">
                    Palmarés y Camisetas Históricas
                </h2>

                <!-- SECCIÓN 1: Vitrina de Trofeos -->
                <div style="margin-bottom:28px;">
                    <h3 style="font-size:1.1rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-main); margin-bottom:12px;">
                        Vitrina de Trofeos
                    </h3>
                    <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px;">
                        ${trophiesHtml}
                    </div>
                </div>

                <!-- SECCIÓN 2: Camisetas Históricas por Año -->
                <div>
                    <h3 style="font-size:1.1rem; font-family:var(--font-heading); font-weight:800; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-main); margin-bottom:14px; text-align:center;">
                        Camisetas Históricas
                    </h3>
                    ${seasonsHtml}
                </div>

            </div>
        `;
    },

    bindEvents() {}
};
