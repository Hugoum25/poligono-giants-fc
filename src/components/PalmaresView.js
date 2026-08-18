/* ==========================================
   POLÍGONO GIANTS F7 - VISTA HISTORIA DEL CLUB
   (PALMARÉS, LEYENDAS Y CAMISETAS HISTÓRICAS)
   ========================================== */

import { state } from '../state.js';
import { ClubLogo } from './ClubLogo.js';

export const PalmaresView = {
    activeTab: 'palmares', // 'palmares' | 'leyendas' | 'camisetas'

    seasons: [
        {
            year: "2026 / 2027",
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
            player: {
                title: "Camiseta de Jugador",
                isUpcoming: false,
                img: "./src/assets/jerseys/jersey_2025_2026.jpg"
            },
            gk: {
                title: "Camiseta de Portero",
                isUpcoming: false,
                img: "./src/assets/jerseys/jersey_gk_2025_2026.jpg"
            }
        },
        {
            year: "2024 / 2025",
            player: {
                title: "Camiseta de Jugador",
                isUpcoming: false,
                img: "./src/assets/jerseys/jersey_2024_2025.jpg"
            },
            gk: {
                title: "Camiseta de Portero",
                isUpcoming: false,
                img: "./src/assets/jerseys/jersey_gk_2024_2025.jpg"
            }
        }
    ],

    trophies: [
        { title: "Campeón de Copa F7 Gijón", year: "2024", desc: "Primer título oficial conquistado tras una tanda de penaltis en la gran final." },
        { title: "Subcampeón de Liga Regular", year: "2025", desc: "Temporada récord de puntos luchando hasta la última jornada del torneo." },
        { title: "Trofeo Fair Play & Juego Limpio", year: "2024", desc: "Reconocimiento otorgado al comportamiento y deportividad del equipo." },
        { title: "Bota de Oro de la Liga (Rodrigo Cuesta #9)", year: "2024", desc: "Máximo goleador absoluto del campeonato con 22 dianas anotadas." }
    ],

    legends: [
        {
            name: "Rubén Montes",
            number: 10,
            role: "Capitán Histórico",
            stats: "48 Partidos • 18 Goles • 24 Asistencias",
            desc: "Conductor del medio campo y referente moral. El primer gran líder que levantó el trofeo de Copa para el Polígono Giants FC."
        },
        {
            name: "Rodrigo Cuesta",
            number: 9,
            role: "Máximo Goleador Histórico",
            stats: "36 Partidos • 42 Goles • 8 Asistencias",
            desc: "El ariete más letal que ha visto la liga. Promedio goleador demoledor y autor del hat-trick más rápido del club."
        },
        {
            name: "Miguel",
            number: 13,
            role: "El Muro Rosinegro",
            stats: "44 Partidos • 16 Puertas a Cero",
            desc: "Héroe inolvidable en la tanda de penaltis de la final de Copa 2024. Paradas decisivas y liderazgo bajo los tres palos."
        },
        {
            name: "Hugo Uría",
            number: 2,
            role: "El Rayo de la Banda",
            stats: "46 Partidos • 12 Goles • 31 Asistencias",
            desc: "Incombustible en el carril diestro. Despliegue físico, centros medidos y entrega total."
        },
        {
            name: "Dario Álvarez",
            number: 8,
            role: "El Arquitecto del Juego",
            stats: "38 Partidos • 14 Goles • 20 Asistencias",
            desc: "Elegancia en la medular. Dominio del ritmo de juego y autor del gol decisivo en el derbi histórico 2025."
        }
    ],

    renderPalmaresContent() {
        const trophiesHtml = this.trophies.map(t => `
            <div class="glass-card" style="padding:16px 20px; border:1px solid var(--border-color); background:rgba(255,255,255,0.02);">
                <div style="font-size:0.75rem; font-family:var(--font-mono); font-weight:700; color:var(--club-primary); text-transform:uppercase;">
                    Temporada ${t.year}
                </div>
                <h4 style="font-size:1.05rem; font-family:var(--font-heading); margin:4px 0 6px 0; color:var(--text-main); font-weight:800;">
                    ${t.title}
                </h4>
                <p style="font-size:0.85rem; color:var(--text-muted); margin:0; line-height:1.4;">
                    ${t.desc}
                </p>
            </div>
        `).join('');

        return `
            <div style="animation:fadeIn 0.3s ease;">
                <!-- Récords Globales -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:14px; margin-bottom:28px;">
                    <div class="glass-card" style="padding:14px; text-align:center;">
                        <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase;">Partidos Disputados</div>
                        <div style="font-size:1.8rem; font-family:var(--font-heading); color:var(--text-main); font-weight:800; margin-top:4px;">48</div>
                    </div>
                    <div class="glass-card" style="padding:14px; text-align:center;">
                        <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase;">Goles Anotados</div>
                        <div style="font-size:1.8rem; font-family:var(--font-heading); color:var(--text-main); font-weight:800; margin-top:4px;">142</div>
                    </div>
                    <div class="glass-card" style="padding:14px; text-align:center;">
                        <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase;">Efectividad Victorias</div>
                        <div style="font-size:1.8rem; font-family:var(--font-heading); color:var(--text-main); font-weight:800; margin-top:4px;">68%</div>
                    </div>
                    <div class="glass-card" style="padding:14px; text-align:center;">
                        <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--text-muted); text-transform:uppercase;">Títulos y Reconocimientos</div>
                        <div style="font-size:1.8rem; font-family:var(--font-heading); color:var(--club-primary); font-weight:800; margin-top:4px;">4</div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:14px;">
                    ${trophiesHtml}
                </div>
            </div>
        `;
    },

    renderLeyendasContent() {
        const legendsHtml = this.legends.map(l => `
            <div class="glass-card" style="padding:20px; border:1px solid var(--border-color); background:rgba(255,255,255,0.02); display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <h3 style="font-size:1.25rem; font-family:var(--font-heading); margin:0; color:var(--text-main); font-weight:800;">
                            ${l.name}
                        </h3>
                        <span style="font-size:1.1rem; font-family:var(--font-heading); font-weight:800; color:var(--club-primary);">
                            #${l.number}
                        </span>
                    </div>

                    <div style="font-size:0.85rem; font-family:var(--font-heading); color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:10px;">
                        ${l.role}
                    </div>

                    <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--text-main); margin-bottom:12px; opacity:0.85;">
                        ${l.stats}
                    </div>

                    <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.45; margin:0;">
                        ${l.desc}
                    </p>
                </div>
            </div>
        `).join('');

        return `
            <div style="animation:fadeIn 0.3s ease;">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
                    ${legendsHtml}
                </div>
            </div>
        `;
    },

    renderCamisetasContent() {
        const seasonsHtml = this.seasons.map(s => {
            const renderJersey = (item) => {
                if (item.isUpcoming) {
                    return `
                        <div style="flex:1; text-align:center; padding:20px; display:flex; flex-direction:column; align-items:center; justify-content:center; background:rgba(255,255,255,0.02); border-radius:8px;">
                            <span style="font-size:0.9rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading);">
                                ${item.title}
                            </span>
                        </div>
                    `;
                }

                return `
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; text-align:center;">
                        <span style="font-size:0.9rem; font-weight:800; color:var(--text-main); font-family:var(--font-heading); margin-bottom:10px;">
                            ${item.title}
                        </span>
                        <img src="${item.img}" alt="${item.title}" style="max-height:270px; width:auto; max-width:100%; object-fit:contain; display:block; filter:drop-shadow(0 6px 14px rgba(0,0,0,0.6)); border-radius:8px;">
                    </div>
                `;
            };

            return `
                <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:12px; padding:20px 24px; max-width:580px; width:100%; margin:0 auto 24px auto; box-sizing:border-box;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid var(--border-color); padding-bottom:10px;">
                        <h3 style="font-size:1.3rem; font-family:var(--font-heading); margin:0; color:var(--text-main); font-weight:800;">
                            ${s.year}
                        </h3>
                        ${ClubLogo.render(28)}
                    </div>

                    <div style="display:flex; justify-content:space-around; align-items:flex-start; gap:20px; flex-wrap:wrap;">
                        ${renderJersey(s.player)}
                        ${s.gk ? renderJersey(s.gk) : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div style="animation:fadeIn 0.3s ease;">
                ${seasonsHtml}
            </div>
        `;
    },

    render() {
        let contentHtml = '';
        if (this.activeTab === 'leyendas') {
            contentHtml = this.renderLeyendasContent();
        } else if (this.activeTab === 'camisetas') {
            contentHtml = this.renderCamisetasContent();
        } else {
            contentHtml = this.renderPalmaresContent();
        }

        const tabs = [
            { id: 'palmares',  label: 'Palmarés' },
            { id: 'leyendas',  label: 'Leyendas del Club' },
            { id: 'camisetas', label: 'Camisetas Históricas' }
        ];

        const tabsHtml = tabs.map(t => {
            const isActive = this.activeTab === t.id;
            return `
                <button class="history-tab-btn filter-btn ${isActive ? 'active' : ''}" data-tab="${t.id}">
                    ${t.label}
                </button>
            `;
        }).join('');

        return `
            <div class="container" style="padding-top:28px; padding-bottom:60px;">
                <h2 class="section-title" style="margin-bottom:20px;">
                    Historia del Club
                </h2>

                <!-- Filtros sencillos estilo Plantilla (sin emoticonos) -->
                <div class="squad-filters" style="margin-bottom:24px;">
                    ${tabsHtml}
                </div>

                <!-- Contenido Dinámico -->
                <div>
                    ${contentHtml}
                </div>
            </div>
        `;
    },

    bindEvents() {
        document.querySelectorAll('.history-tab-btn').forEach(btn => {
            btn.onclick = () => {
                const targetTab = btn.getAttribute('data-tab');
                if (targetTab && this.activeTab !== targetTab) {
                    this.activeTab = targetTab;
                    state.notify();
                }
            };
        });
    }
};
