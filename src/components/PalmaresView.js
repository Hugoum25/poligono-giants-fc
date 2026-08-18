/* ==========================================
   POLÍGONO GIANTS F7 - VISTA HISTORIA DEL CLUB
   (PALMARÉS, LEYENDAS Y CAMISETAS HISTÓRICAS)
   ========================================== */

import { state } from '../state.js';
import { ClubLogo } from './ClubLogo.js';
import { teamData, saveLegendsToStorage } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';

export const PalmaresView = {
    activeTab: 'palmares', // 'palmares' | 'leyendas' | 'camisetas'
    editingLegend: null,

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
        { title: "Bota de Oro de la Liga", year: "2024", desc: "Máximo goleador absoluto del campeonato." }
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
        const legendsList = teamData.legends || [];
        const isAdmin = AuthService.isAdmin() || AuthService.isLoggedIn();

        const legendsHtml = legendsList.map(l => {
            const isPortero = (l.role || '').toLowerCase() === 'portero';
            const statsText = isPortero ? `${l.matches || 0} Partidos` : `${l.matches || 0} Partidos • ${l.goals || 0} Goles`;

            return `
                <div class="glass-card" style="padding:20px; border:1px solid var(--border-color); background:rgba(255,255,255,0.02); display:flex; flex-direction:column; justify-content:space-between; position:relative;">
                    <div>
                        ${l.photo ? `
                            <div style="width:70px; height:70px; margin:0 auto 12px auto; display:flex; align-items:center; justify-content:center;">
                                <img src="${l.photo}" class="player-png-feathered" draggable="false" style="max-height:100%; max-width:100%; object-fit:contain;" />
                            </div>
                        ` : ''}

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

                        <div style="font-size:0.85rem; font-family:var(--font-mono); color:var(--club-primary); font-weight:800; margin-bottom:10px;">
                            ${statsText}
                        </div>

                        <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.45; margin:0;">
                            ${l.desc}
                        </p>
                    </div>

                    ${isAdmin ? `
                        <div style="margin-top:16px; border-top:1px solid rgba(255,255,255,0.06); padding-top:12px; text-align:right;">
                            <button class="btn btn-secondary btn-edit-legend" data-legend-id="${l.id}" style="font-size:0.75rem; padding:5px 12px; font-weight:800; color:var(--club-primary);">
                                Editar Leyenda
                            </button>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');

        return `
            <div style="animation:fadeIn 0.3s ease;">
                ${isAdmin ? `
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; background:rgba(255,42,133,0.1); border:1px solid var(--club-primary); padding:10px 16px; border-radius:6px;">
                        <span style="font-size:0.82rem; font-weight:800; color:#fff;">Panel de Administración de Leyendas del Club</span>
                        <button class="btn btn-primary btn-add-legend" style="font-size:0.75rem; padding:6px 14px; font-weight:800;">
                            Añadir Leyenda
                        </button>
                    </div>
                ` : ''}

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

    renderEditModal() {
        if (!this.editingLegend) return '';
        const l = this.editingLegend;
        const currentRole = l.role || 'Portero';

        return `
            <div class="modal-overlay active" id="legend-edit-modal-overlay">
                <div class="glass-card" style="max-width:520px; width:100%; padding:24px; position:relative; animation:slideUp 0.3s ease;">
                    <button class="modal-close" id="close-legend-modal-btn">✕</button>

                    <h3 style="font-size:1.3rem; margin-bottom:6px; font-family:var(--font-heading); color:var(--club-primary);">
                        ${l.id ? 'Editar Leyenda del Club' : 'Añadir Nueva Leyenda'}
                    </h3>
                    <p style="color:var(--text-muted); font-size:0.8rem; margin-bottom:16px;">
                        Modifica los datos que se mostrarán públicamente en la sección de Historia & Leyendas.
                    </p>

                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div style="display:grid; grid-template-columns:2fr 1fr; gap:10px;">
                            <div>
                                <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Nombre del Jugador</label>
                                <input type="text" id="edit-legend-name" class="form-input" style="width:100%; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${l.name || ''}" placeholder="Ej. Diego Mon">
                            </div>
                            <div>
                                <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Dorsal #</label>
                                <input type="number" id="edit-legend-number" class="form-input" min="1" max="99" style="width:100%; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${l.number || 1}">
                            </div>
                        </div>

                        <div>
                            <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Posición / Rol</label>
                            <select id="edit-legend-role" class="form-input" style="width:100%; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;">
                                <option value="Portero" ${currentRole === 'Portero' ? 'selected' : ''}>Portero</option>
                                <option value="Defensa" ${currentRole === 'Defensa' ? 'selected' : ''}>Defensa</option>
                                <option value="Medio" ${currentRole === 'Medio' ? 'selected' : ''}>Medio</option>
                                <option value="Delantero" ${currentRole === 'Delantero' ? 'selected' : ''}>Delantero</option>
                            </select>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                            <div>
                                <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Partidos</label>
                                <input type="number" id="edit-legend-matches" class="form-input" min="0" style="width:100%; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${l.matches || 0}">
                            </div>
                            <div>
                                <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Goles (Si no es Portero)</label>
                                <input type="number" id="edit-legend-goals" class="form-input" min="0" style="width:100%; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${l.goals || 0}">
                            </div>
                        </div>

                        <div>
                            <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Descripción</label>
                            <textarea id="edit-legend-desc" class="form-input" style="width:100%; height:80px; padding:8px; font-size:0.85rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; resize:vertical;">${l.desc || ''}</textarea>
                        </div>

                        <div>
                            <label style="font-size:0.72rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Foto PNG (Subir archivo)</label>
                            <input type="file" id="edit-legend-file" accept="image/*" class="form-input" style="width:100%; padding:6px; font-size:0.8rem; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;">
                        </div>

                        <div style="display:flex; justify-content:space-between; gap:10px; margin-top:12px;">
                            ${l.id ? `
                                <button class="btn btn-secondary" id="btn-delete-legend" style="background:rgba(255,68,68,0.2); border:1px solid #ff4444; color:#ff4444; font-size:0.8rem; padding:8px 14px;">
                                    Eliminar
                                </button>
                            ` : '<div></div>'}
                            
                            <div style="display:flex; gap:8px;">
                                <button class="btn btn-secondary" id="btn-cancel-legend" style="font-size:0.8rem; padding:8px 14px;">
                                    Cancelar
                                </button>
                                <button class="btn btn-primary" id="btn-save-legend" style="font-size:0.8rem; padding:8px 18px; font-weight:800;">
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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

                <div class="squad-filters" style="margin-bottom:24px;">
                    ${tabsHtml}
                </div>

                <div>
                    ${contentHtml}
                </div>
            </div>

            ${this.renderEditModal()}
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

        // Botón Editar Leyenda
        document.querySelectorAll('.btn-edit-legend').forEach(btn => {
            btn.onclick = () => {
                const lId = parseInt(btn.getAttribute('data-legend-id'));
                const legend = (teamData.legends || []).find(l => l.id === lId);
                if (legend) {
                    this.editingLegend = { ...legend };
                    state.notify();
                }
            };
        });

        // Botón Añadir Leyenda
        const btnAdd = document.querySelector('.btn-add-legend');
        if (btnAdd) {
            btnAdd.onclick = () => {
                this.editingLegend = {
                    id: 0,
                    name: '',
                    number: 1,
                    role: 'Portero',
                    matches: 0,
                    goals: 0,
                    desc: '',
                    photo: ''
                };
                state.notify();
            };
        }

        // Modal de edición de leyenda
        const closeBtn = document.getElementById('close-legend-modal-btn');
        const cancelBtn = document.getElementById('btn-cancel-legend');
        if (closeBtn) closeBtn.onclick = () => { this.editingLegend = null; state.notify(); };
        if (cancelBtn) cancelBtn.onclick = () => { this.editingLegend = null; state.notify(); };

        const saveBtn = document.getElementById('btn-save-legend');
        if (saveBtn) {
            saveBtn.onclick = () => {
                const name = (document.getElementById('edit-legend-name')?.value || '').trim();
                const number = parseInt(document.getElementById('edit-legend-number')?.value) || 1;
                const role = (document.getElementById('edit-legend-role')?.value || 'Portero');
                const matches = parseInt(document.getElementById('edit-legend-matches')?.value) || 0;
                const goals = parseInt(document.getElementById('edit-legend-goals')?.value) || 0;
                const desc = (document.getElementById('edit-legend-desc')?.value || '').trim();
                const fileInput = document.getElementById('edit-legend-file');

                if (!name) {
                    alert("Por favor, introduce el nombre de la leyenda.");
                    return;
                }

                const processSave = (photoVal) => {
                    if (!teamData.legends) teamData.legends = [];

                    if (this.editingLegend.id === 0) {
                        const newId = teamData.legends.length > 0 ? Math.max(...teamData.legends.map(l => l.id)) + 1 : 1;
                        teamData.legends.push({
                            id: newId,
                            name,
                            number,
                            role,
                            matches,
                            goals,
                            desc,
                            photo: photoVal
                        });
                    } else {
                        const target = teamData.legends.find(l => l.id === this.editingLegend.id);
                        if (target) {
                            target.name = name;
                            target.number = number;
                            target.role = role;
                            target.matches = matches;
                            target.goals = goals;
                            target.desc = desc;
                            if (photoVal) target.photo = photoVal;
                        }
                    }

                    saveLegendsToStorage();
                    this.editingLegend = null;
                    state.notify();
                };

                if (fileInput && fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        processSave(e.target.result);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    processSave(this.editingLegend.photo || '');
                }
            };
        }

        const deleteBtn = document.getElementById('btn-delete-legend');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                if (confirm("¿Estás seguro de eliminar esta leyenda del club?")) {
                    teamData.legends = (teamData.legends || []).filter(l => l.id !== this.editingLegend.id);
                    saveLegendsToStorage();
                    this.editingLegend = null;
                    state.notify();
                }
            };
        }
    }
};
