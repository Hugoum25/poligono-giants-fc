/* ==========================================
   POLÍGONO GIANTS F7 - VISTA HISTORIA DEL CLUB
   (PALMARÉS, LEYENDAS Y CAMISETAS HISTÓRICAS)
   ========================================== */

import { state } from '../state.js';
import { ClubLogo } from './ClubLogo.js';
import { teamData, saveLegendsToStorage, saveTrophiesToStorage, saveHistoryStatsToStorage } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead } from './ui.js';

export const PalmaresView = {
    activeTab: 'palmares', // 'palmares' | 'leyendas' | 'camisetas'
    editingLegend: null,
    editingTrophy: null,
    editingHistoryStats: false,

    // Por defecto, las temporadas están contraídas (collapsed)
    expandedSeasons: {
        "2026 / 2027": false,
        "2025 / 2026": false,
        "2024 / 2025": false
    },

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

    renderPalmaresContent() {
        const isAdmin = AuthService.isAdmin() || AuthService.isLoggedIn();
        const stats = teamData.historyStats || { matches: 48, wins: 32, draws: 8, losses: 8 };
        const seasonKeys = ["2026 / 2027", "2025 / 2026", "2024 / 2025"];
        const trophiesList = teamData.trophies || [];
        const winRate = stats.matches ? Math.round((stats.wins / stats.matches) * 100) : 0;

        const tapes = seasonKeys.map((seasonName, i) => {
            const open = !!this.expandedSeasons[seasonName];
            const items = trophiesList.filter(t => t.season === seasonName);
            const itemsHtml = items.length ? items.map(t => `
                <article class="trophy">
                    ${I('trophy', 'pg-ico--lg')}
                    <div class="trophy__body">
                        <h4 class="trophy__title">${t.title}</h4>
                        <p class="trophy__desc">${t.desc}</p>
                    </div>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs btn-edit-trophy" data-trophy-id="${t.id}" title="Editar premio" aria-label="Editar premio">${I('edit')}</button>` : ''}
                </article>
            `).join('') : `<div class="pg-empty trophy-empty">Cinta vacía · sin premios registrados</div>`;

            return `
                <div class="tape ${open ? 'is-open' : ''}">
                    <div class="tape__label season-trophies-header" data-season="${seasonName}" role="button" tabindex="0" aria-expanded="${open}">
                        <span class="tape__side">VHS · ${String(seasonKeys.length - i).padStart(2, '0')}</span>
                        <span class="tape__title">Temporada ${seasonName}</span>
                        <span class="tape__count t-meta">${items.length} ${items.length === 1 ? 'premio' : 'premios'}</span>
                        ${isAdmin ? `<button type="button" class="pg-btn pg-btn--xs btn-add-trophy" data-season="${seasonName}" onclick="event.stopPropagation();">${I('plus')} Premio</button>` : ''}
                        <span class="tape__chev">${I('chevronD')}</span>
                    </div>
                    ${open ? `<div class="tape__body">${itemsHtml}</div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="history-block">
                <div class="pg-h">
                    <h2 class="pg-h__title">Números del club</h2>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--sm" id="btn-edit-history-stats">${I('edit')} Editar récords</button>` : `<span class="pg-h__meta">Desde la fundación</span>`}
                </div>
                <div class="pg-stats history-stats">
                    <div class="pg-stat"><div class="pg-stat__value">${stats.matches || 0}</div><div class="pg-stat__label">Partidos</div></div>
                    <div class="pg-stat pg-stat--signal"><div class="pg-stat__value">${stats.wins || 0}</div><div class="pg-stat__label">Victorias</div></div>
                    <div class="pg-stat"><div class="pg-stat__value">${stats.draws || 0}</div><div class="pg-stat__label">Empates</div></div>
                    <div class="pg-stat"><div class="pg-stat__value">${stats.losses || 0}</div><div class="pg-stat__label">Derrotas</div></div>
                    <div class="pg-stat"><div class="pg-stat__value">${winRate}<small>%</small></div><div class="pg-stat__label">% victorias</div></div>
                </div>
            </div>
            <div class="history-block">
                <div class="pg-h"><h2 class="pg-h__title">Palmarés</h2><span class="pg-h__meta">Archivo por temporadas</span></div>
                <div class="tapes">${tapes}</div>
            </div>
        `;
    },

    renderLeyendasContent() {
        const legends = teamData.legends || [];
        const isAdmin = AuthService.isAdmin() || AuthService.isLoggedIn();

        const cards = legends.map(l => {
            const gk = (l.role || '').toLowerCase() === 'portero';
            return `
                <article class="legend">
                    <span class="legend__num" aria-hidden="true">${l.number}</span>
                    ${l.photo ? `<img src="${l.photo}" class="legend__img" alt="" draggable="false" />` : ''}
                    <div class="legend__body">
                        <span class="t-meta t-signal">#${l.number} · ${l.role}</span>
                        <h3 class="legend__name">${l.name}</h3>
                        <div class="legend__stats t-meta">
                            <span><b>${l.matches || 0}</b> PJ</span>
                            ${gk ? '' : `<span><b>${l.goals || 0}</b> Goles</span>`}
                        </div>
                        <p class="legend__desc">${l.desc || ''}</p>
                    </div>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs legend__edit btn-edit-legend" data-legend-id="${l.id}" title="Editar leyenda" aria-label="Editar leyenda">${I('edit')}</button>` : ''}
                </article>
            `;
        }).join('');

        return `
            <div class="history-block">
                <div class="pg-h">
                    <h2 class="pg-h__title">Leyendas</h2>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--sm btn-add-legend">${I('plus')} Añadir leyenda</button>` : `<span class="pg-h__meta">Salón de la fama rosinegro</span>`}
                </div>
                ${legends.length ? `<div class="legends-grid">${cards}</div>` : `<div class="pg-empty">Sin leyendas todavía</div>`}
            </div>
        `;
    },

    renderCamisetasContent() {
        const shirt = (item) => item.isUpcoming
            ? `<figure class="kit kit--soon"><div class="kit__frame">${I('shirt', 'pg-ico--lg')}<span class="t-meta">Próximamente</span></div><figcaption class="t-meta">${item.title}</figcaption></figure>`
            : `<figure class="kit"><div class="kit__frame"><img src="${item.img}" alt="${item.title}" loading="lazy" /></div><figcaption class="t-meta">${item.title}</figcaption></figure>`;

        return `
            <div class="history-block kits">
                ${this.seasons.map(s => `
                    <section class="kits__season">
                        <header class="kits__head">
                            <h3 class="kits__year">${s.year}</h3>
                            ${ClubLogo.render(28)}
                        </header>
                        <div class="kits__row">
                            ${shirt(s.player)}
                            ${s.gk ? shirt(s.gk) : ''}
                        </div>
                    </section>
                `).join('')}
            </div>
        `;
    },

    renderEditHistoryStatsModal() {
        if (!this.editingHistoryStats) return '';
        const s = teamData.historyStats || { matches: 48, wins: 32, draws: 8, losses: 8 };
        const f = (id, label, val) => `<div class="pg-field"><label class="pg-label" for="${id}">${label}</label><input type="number" id="${id}" class="pg-input" min="0" value="${val || 0}"></div>`;
        return `
            <div class="modal-overlay active" id="history-stats-edit-modal-overlay">
                <div class="pg-modal">
                    ${ModalHead({ kicker: 'Admin · Historia', title: 'Récords del club', closeId: 'close-history-stats-modal-btn' })}
                    <div class="pg-form pg-modal__body">
                        <div class="pg-form__row">${f('edit-hs-matches', 'Partidos', s.matches)}${f('edit-hs-wins', 'Victorias', s.wins)}</div>
                        <div class="pg-form__row">${f('edit-hs-draws', 'Empates', s.draws)}${f('edit-hs-losses', 'Derrotas', s.losses)}</div>
                    </div>
                    <div class="pg-modal__foot">
                        <button type="button" class="pg-btn" id="btn-cancel-hs">Cancelar</button>
                        <button type="button" class="pg-btn pg-btn--primary" id="btn-save-hs">${I('check')} Guardar</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderEditLegendModal() {
        if (!this.editingLegend) return '';
        const l = this.editingLegend;
        const role = l.role || 'Portero';
        return `
            <div class="modal-overlay active" id="legend-edit-modal-overlay">
                <div class="pg-modal">
                    ${ModalHead({ kicker: 'Admin · Leyendas', title: l.id ? 'Editar leyenda' : 'Nueva leyenda', closeId: 'close-legend-modal-btn' })}
                    <div class="pg-form pg-modal__body">
                        <div class="pg-form__row">
                            <div class="pg-field"><label class="pg-label" for="edit-legend-name">Nombre</label><input type="text" id="edit-legend-name" class="pg-input" value="${l.name || ''}" placeholder="Diego Mon"></div>
                            <div class="pg-field"><label class="pg-label" for="edit-legend-number">Dorsal</label><input type="number" id="edit-legend-number" class="pg-input" min="1" max="99" value="${l.number || 1}"></div>
                        </div>
                        <div class="pg-field">
                            <label class="pg-label" for="edit-legend-role">Posición</label>
                            <select id="edit-legend-role" class="pg-input">
                                ${['Portero', 'Defensa', 'Medio', 'Delantero'].map(r => `<option value="${r}" ${role === r ? 'selected' : ''}>${r}</option>`).join('')}
                            </select>
                        </div>
                        <div class="pg-form__row">
                            <div class="pg-field"><label class="pg-label" for="edit-legend-matches">Partidos</label><input type="number" id="edit-legend-matches" class="pg-input" min="0" value="${l.matches || 0}"></div>
                            <div class="pg-field"><label class="pg-label" for="edit-legend-goals">Goles (no porteros)</label><input type="number" id="edit-legend-goals" class="pg-input" min="0" value="${l.goals || 0}"></div>
                        </div>
                        <div class="pg-field"><label class="pg-label" for="edit-legend-desc">Descripción</label><textarea id="edit-legend-desc" class="pg-input" rows="3">${l.desc || ''}</textarea></div>
                        <div class="pg-field"><label class="pg-label" for="edit-legend-file">Foto PNG</label><input type="file" id="edit-legend-file" accept="image/*" class="pg-input"></div>
                    </div>
                    <div class="pg-modal__foot pg-row--between">
                        ${l.id ? `<button type="button" class="pg-btn pg-btn--danger" id="btn-delete-legend">${I('trash')} Eliminar</button>` : '<span></span>'}
                        <div class="pg-row">
                            <button type="button" class="pg-btn" id="btn-cancel-legend">Cancelar</button>
                            <button type="button" class="pg-btn pg-btn--primary" id="btn-save-legend">${I('check')} Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderEditTrophyModal() {
        if (!this.editingTrophy) return '';
        const t = this.editingTrophy;
        return `
            <div class="modal-overlay active" id="trophy-edit-modal-overlay">
                <div class="pg-modal">
                    ${ModalHead({ kicker: 'Admin · Palmarés', title: t.id ? 'Editar premio' : 'Nuevo premio', closeId: 'close-trophy-modal-btn' })}
                    <div class="pg-form pg-modal__body">
                        <div class="pg-field">
                            <label class="pg-label" for="edit-trophy-season">Temporada</label>
                            <select id="edit-trophy-season" class="pg-input">
                                ${['2026 / 2027', '2025 / 2026', '2024 / 2025'].map(y => `<option value="${y}" ${t.season === y ? 'selected' : ''}>${y}</option>`).join('')}
                            </select>
                        </div>
                        <div class="pg-field"><label class="pg-label" for="edit-trophy-title">Título</label><input type="text" id="edit-trophy-title" class="pg-input" value="${t.title || ''}" placeholder="Campeón de Copa F7 Gijón"></div>
                        <div class="pg-field"><label class="pg-label" for="edit-trophy-desc">Detalle</label><textarea id="edit-trophy-desc" class="pg-input" rows="3">${t.desc || ''}</textarea></div>
                    </div>
                    <div class="pg-modal__foot pg-row--between">
                        ${t.id ? `<button type="button" class="pg-btn pg-btn--danger" id="btn-delete-trophy">${I('trash')} Eliminar</button>` : '<span></span>'}
                        <div class="pg-row">
                            <button type="button" class="pg-btn" id="btn-cancel-trophy">Cancelar</button>
                            <button type="button" class="pg-btn pg-btn--primary" id="btn-save-trophy">${I('check')} Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    render() {
        const tabs = [
            { id: 'palmares',  label: 'Palmarés' },
            { id: 'leyendas',  label: 'Leyendas' },
            { id: 'camisetas', label: 'Camisetas' }
        ];
        const content = this.activeTab === 'leyendas' ? this.renderLeyendasContent()
            : this.activeTab === 'camisetas' ? this.renderCamisetasContent()
            : this.renderPalmaresContent();

        return `
            <div class="pg-view">
                ${LowerThird({ page: 'palmares', title: 'Historia', sub: 'Archivo del club · Palmarés, leyendas y camisetas' })}
                <div class="pg-tabs history-tabs" role="tablist">
                    ${tabs.map(t => `<button type="button" role="tab" class="pg-tab history-tab-btn ${this.activeTab === t.id ? 'is-active' : ''}" data-tab="${t.id}" aria-selected="${this.activeTab === t.id}">${t.label}</button>`).join('')}
                </div>
                ${content}
            </div>
            ${this.renderEditHistoryStatsModal()}
            ${this.renderEditLegendModal()}
            ${this.renderEditTrophyModal()}
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

        // ------------------------------------
        // EVENTOS COLAPSO/EXPANSIÓN DE TEMPORADAS DE PREMIOS
        // ------------------------------------
        document.querySelectorAll('.season-trophies-header').forEach(header => {
            header.onkeydown = (e) => { if (e.key === 'Enter' && e.target === header) header.click(); };
            header.onclick = () => {
                const season = header.getAttribute('data-season');
                if (season) {
                    this.expandedSeasons[season] = !this.expandedSeasons[season];
                    state.notify();
                }
            };
        });

        // ------------------------------------
        // EVENTOS GESTIÓN DE STATS HISTÓRICAS DEL EQUIPO
        // ------------------------------------
        const btnEditHS = document.getElementById('btn-edit-history-stats');
        if (btnEditHS) {
            btnEditHS.onclick = () => {
                this.editingHistoryStats = true;
                state.notify();
            };
        }

        const closeHSBtn = document.getElementById('close-history-stats-modal-btn');
        const cancelHSBtn = document.getElementById('btn-cancel-hs');
        if (closeHSBtn) closeHSBtn.onclick = () => { this.editingHistoryStats = false; state.notify(); };
        if (cancelHSBtn) cancelHSBtn.onclick = () => { this.editingHistoryStats = false; state.notify(); };

        const saveHSBtn = document.getElementById('btn-save-hs');
        if (saveHSBtn) {
            saveHSBtn.onclick = () => {
                const matches = parseInt(document.getElementById('edit-hs-matches')?.value) || 0;
                const wins = parseInt(document.getElementById('edit-hs-wins')?.value) || 0;
                const draws = parseInt(document.getElementById('edit-hs-draws')?.value) || 0;
                const losses = parseInt(document.getElementById('edit-hs-losses')?.value) || 0;

                teamData.historyStats = { matches, wins, draws, losses };
                saveHistoryStatsToStorage();
                this.editingHistoryStats = false;
                state.notify();
            };
        }

        // ------------------------------------
        // EVENTOS GESTIÓN DE PREMIOS / TROFEOS
        // ------------------------------------
        document.querySelectorAll('.btn-edit-trophy').forEach(btn => {
            btn.onclick = () => {
                const tId = parseInt(btn.getAttribute('data-trophy-id'));
                const trophy = (teamData.trophies || []).find(t => t.id === tId);
                if (trophy) {
                    this.editingTrophy = { ...trophy };
                    state.notify();
                }
            };
        });

        document.querySelectorAll('.btn-add-trophy').forEach(btn => {
            btn.onclick = () => {
                const season = btn.getAttribute('data-season') || "2026 / 2027";
                this.editingTrophy = {
                    id: 0,
                    season: season,
                    title: '',
                    desc: ''
                };
                state.notify();
            };
        });

        const closeTrophyBtn = document.getElementById('close-trophy-modal-btn');
        const cancelTrophyBtn = document.getElementById('btn-cancel-trophy');
        if (closeTrophyBtn) closeTrophyBtn.onclick = () => { this.editingTrophy = null; state.notify(); };
        if (cancelTrophyBtn) cancelTrophyBtn.onclick = () => { this.editingTrophy = null; state.notify(); };

        const saveTrophyBtn = document.getElementById('btn-save-trophy');
        if (saveTrophyBtn) {
            saveTrophyBtn.onclick = () => {
                const season = document.getElementById('edit-trophy-season')?.value || "2026 / 2027";
                const title = (document.getElementById('edit-trophy-title')?.value || '').trim();
                const desc = (document.getElementById('edit-trophy-desc')?.value || '').trim();

                if (!title) {
                    alert("Por favor, introduce el nombre del premio.");
                    return;
                }

                if (!teamData.trophies) teamData.trophies = [];

                if (this.editingTrophy.id === 0) {
                    const newId = teamData.trophies.length > 0 ? Math.max(...teamData.trophies.map(t => t.id)) + 1 : 1;
                    teamData.trophies.push({ id: newId, season, title, desc });
                } else {
                    const target = teamData.trophies.find(t => t.id === this.editingTrophy.id);
                    if (target) {
                        target.season = season;
                        target.title = title;
                        target.desc = desc;
                    }
                }

                saveTrophiesToStorage();
                this.editingTrophy = null;
                state.notify();
            };
        }

        const deleteTrophyBtn = document.getElementById('btn-delete-trophy');
        if (deleteTrophyBtn) {
            deleteTrophyBtn.onclick = () => {
                if (confirm("¿Deseas eliminar este premio del palmarés?")) {
                    teamData.trophies = (teamData.trophies || []).filter(t => t.id !== this.editingTrophy.id);
                    saveTrophiesToStorage();
                    this.editingTrophy = null;
                    state.notify();
                }
            };
        }

        // ------------------------------------
        // EVENTOS GESTIÓN DE LEYENDAS
        // ------------------------------------
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

        const btnAddLegend = document.querySelector('.btn-add-legend');
        if (btnAddLegend) {
            btnAddLegend.onclick = () => {
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

        const closeLegendBtn = document.getElementById('close-legend-modal-btn');
        const cancelLegendBtn = document.getElementById('btn-cancel-legend');
        if (closeLegendBtn) closeLegendBtn.onclick = () => { this.editingLegend = null; state.notify(); };
        if (cancelLegendBtn) cancelLegendBtn.onclick = () => { this.editingLegend = null; state.notify(); };

        const saveLegendBtn = document.getElementById('btn-save-legend');
        if (saveLegendBtn) {
            saveLegendBtn.onclick = () => {
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

        const deleteLegendBtn = document.getElementById('btn-delete-legend');
        if (deleteLegendBtn) {
            deleteLegendBtn.onclick = () => {
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
