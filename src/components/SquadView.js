/* ==========================================
   FC HUB - VISTA DE PLANTILLA Y ALINEACIÓN FAVORITA (1-3-2-1 DRAG & DROP)
   ========================================== */

import { state } from '../state.js';
import { teamData, savePlayersToStorage } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead } from './ui.js';

export const SquadView = {
    activeFilter: "todos", // todos, porteros, defensas, carrileros, medios, delanteros
    activeFormation: "3-2-1", // 3-2-1, 2-3-1, 2-2-2
    draggedPlayerId: null, // ID del jugador que se está arrastrando
    
    // Alineación táctica
    lineup: {
        por: 1,     // Miguel #13
        car_izq: 5, // Hugo Uría #2
        cen: 2,     // Javier Chimeno #12
        car_der: 6, // Enol #4
        mc_izq: 11, // Dario Álvarez #8
        mc_der: 12, // Rubén Montes #10
        del: 17     // Rodrigo Cuesta #9
    },

    getSlotsConfig() {
        if (this.activeFormation === '2-3-1') {
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "def_izq", label: "DEF-IZQ", name: "Defensa Izquierdo",   gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "def_der", label: "DEF-DER", name: "Defensa Derecho",     gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MI",      name: "Medio Izquierdo",     gridPos: "grid-area: 2 / 1 / 3 / 2;" },
                { id: "mc_cen",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 2 / 3 / 3;" },
                { id: "mc_der",  label: "MD",      name: "Medio Derecho",       gridPos: "grid-area: 2 / 3 / 3 / 4;" },
                { id: "del",     label: "DEL",     name: "Delantero Centro",    gridPos: "grid-area: 1 / 2 / 2 / 3;" }
            ];
        } else if (this.activeFormation === '2-2-2') {
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "def_izq", label: "DEF-IZQ", name: "Defensa Izquierdo",   gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "def_der", label: "DEF-DER", name: "Defensa Derecho",     gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 1 / 3 / 2; transform: translateX(20px);" },
                { id: "mc_der",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 3 / 3 / 4; transform: translateX(-20px);" },
                { id: "del_izq", label: "DEL",     name: "Delantero",           gridPos: "grid-area: 1 / 1 / 2 / 2; transform: translateX(22px);" },
                { id: "del_der", label: "DEL",     name: "Delantero",           gridPos: "grid-area: 1 / 3 / 2 / 4; transform: translateX(-22px);" }
            ];
        } else {
            // Default: 3-2-1
            return [
                { id: "por",     label: "POR",     name: "Portero",             gridPos: "grid-area: 4 / 2 / 5 / 3;" },
                { id: "car_izq", label: "CAR-IZQ", name: "Carrilero Izquierdo", gridPos: "grid-area: 3 / 1 / 4 / 2;" },
                { id: "cen",     label: "CENTRAL", name: "Defensa Central",     gridPos: "grid-area: 3 / 2 / 4 / 3;" },
                { id: "car_der", label: "CAR-DER", name: "Carrilero Derecho",   gridPos: "grid-area: 3 / 3 / 4 / 4;" },
                { id: "mc_izq",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 1 / 3 / 2; transform: translateX(20px);" },
                { id: "mc_der",  label: "MC",      name: "Medio Centro",        gridPos: "grid-area: 2 / 3 / 3 / 4; transform: translateX(-20px);" },
                { id: "del",     label: "DEL",     name: "Delantero Centro",    gridPos: "grid-area: 1 / 2 / 2 / 3;" }
            ];
        }
    },

    render() {
        const isAdmin = AuthService.isAdmin();
        const players = [...teamData.players].sort((a, b) => a.number - b.number);
        const filtered = players.filter(p => this.activeFilter === 'todos' || p.category === this.activeFilter);

        const FILTERS = [
            ['todos', 'Todos'], ['porteros', 'Porteros'], ['defensas', 'Defensas'],
            ['carrileros', 'Carrileros'], ['medios', 'Medios'], ['delanteros', 'Delanteros']
        ];
        const filtersHtml = FILTERS.map(([id, label]) => {
            const n = id === 'todos' ? players.length : players.filter(p => p.category === id).length;
            return `<button type="button" class="pg-chip filter-btn ${this.activeFilter === id ? 'is-active' : ''}" data-filter="${id}">${label}<span class="pg-chip__count">${n}</span></button>`;
        }).join('');

        const photo = (p, cls) => p.photo
            ? `<img src="${p.photo}" class="${cls}" alt="" draggable="false" oncontextmenu="return false;" />`
            : `<span class="${cls} player-silhouette">${I(p.position && p.position.includes('Portero') ? 'glove' : 'user')}</span>`;

        const playersHtml = filtered.map(p => {
            const st = p.stats || {};
            return `
                <article class="player-card player-card-compact" data-player-id="${p.id}" role="button" tabindex="0" aria-label="${p.name}, dorsal ${p.number}">
                    <span class="player-card__num" aria-hidden="true">${p.number}</span>
                    <div class="player-card__photo">${photo(p, 'player-card__img')}</div>
                    <div class="player-card__info">
                        <span class="player-card__pos t-meta">${String(p.number).padStart(2, '0')} · ${p.position}</span>
                        <h3 class="player-card__name">${p.name}</h3>
                        ${p.nickname ? `<span class="player-card__nick">“${p.nickname}”</span>` : ''}
                    </div>
                    <dl class="player-card__stats t-meta">
                        <div><dt>PJ</dt><dd>${st.matches || 0}</dd></div>
                        <div><dt>G</dt><dd>${st.goals || 0}</dd></div>
                        <div><dt>A</dt><dd>${st.assists || 0}</dd></div>
                    </dl>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs player-card__edit btn-quick-edit-player" data-player-id="${p.id}" title="Editar jugador" aria-label="Editar jugador">${I('edit')}</button>` : ''}
                </article>
            `;
        }).join('');

        // Ranking
        const tab = this.rankingTab || 'total';
        const ranked = [...teamData.players].sort((a, b) => {
            const A = a.stats || {}, B = b.stats || {};
            const ta = (A.goals || 0) + (A.assists || 0), tb = (B.goals || 0) + (B.assists || 0);
            const ca = (A.yellowCards || 0) + (A.redCards || 0) + (A.blueCards || 0);
            const cb = (B.yellowCards || 0) + (B.redCards || 0) + (B.blueCards || 0);
            switch (tab) {
                case 'name': return a.name.localeCompare(b.name);
                case 'matches': return (B.matches || 0) - (A.matches || 0);
                case 'goles': return (B.goals || 0) - (A.goals || 0) || (B.assists || 0) - (A.assists || 0);
                case 'asistencias': return (B.assists || 0) - (A.assists || 0) || (B.goals || 0) - (A.goals || 0);
                case 'mvp': return (B.mvp || 0) - (A.mvp || 0) || (B.goals || 0) - (A.goals || 0);
                case 'tarjetas': return cb - ca;
                case 'pos': return a.number - b.number;
                default: return tb - ta || (B.goals || 0) - (A.goals || 0);
            }
        });

        const COLS = [
            ['pos', 'Nº', ''], ['name', 'Jugador', ''], ['matches', 'PJ', 'is-num'], ['goles', 'G', 'is-num'],
            ['asistencias', 'A', 'is-num'], ['mvp', 'MVP', 'is-num'], ['tarjetas', 'Tarj. A/Az/R', 'is-num'], ['total', 'G+A', 'is-num']
        ];
        const thead = COLS.map(([key, label, cls]) => `
            <th class="sortable-th ${cls} ${tab === key ? 'is-sorted' : ''}" data-sort="${key}" ${tab === key ? 'aria-sort="descending"' : ''}>${label}</th>
        `).join('');

        const rows = ranked.map((p, i) => {
            const st = p.stats || {};
            const on = k => tab === k ? 'is-sorted' : '';
            return `
                <tr>
                    <td class="rank-cell ${i < 3 ? 'is-top' : ''}">${String(i + 1).padStart(2, '0')}</td>
                    <td class="${on('name')}"><span class="rank-name">${p.name}</span> <span class="t-meta">#${p.number}</span></td>
                    <td class="is-num ${on('matches')}">${st.matches || 0}</td>
                    <td class="is-num ${on('goles')}">${st.goals || 0}</td>
                    <td class="is-num ${on('asistencias')}">${st.assists || 0}</td>
                    <td class="is-num ${on('mvp')}">${st.mvp || 0}</td>
                    <td class="is-num ${on('tarjetas')}"><span class="card-ct card-ct--y">${st.yellowCards || 0}</span><span class="card-ct card-ct--b">${st.blueCards || 0}</span><span class="card-ct card-ct--r">${st.redCards || 0}</span></td>
                    <td class="is-num rank-total ${on('total')}">${(st.goals || 0) + (st.assists || 0)}</td>
                </tr>
            `;
        }).join('');

        // Ficha de jugador
        let modalHtml = '';
        if (state.selectedPlayerId !== null) {
            const player = teamData.players.find(p => p.id === state.selectedPlayerId);
            if (player) {
                const st = player.stats || {};
                const pj = st.matches || 0;
                const per = v => pj > 0 ? (v / pj).toFixed(2) : '0.00';
                const stat = (v, l, cls = '') => `<div class="pg-stat ${cls}"><div class="pg-stat__value">${v}</div><div class="pg-stat__label">${l}</div></div>`;

                modalHtml = `
                    <div class="modal-overlay active" id="player-modal-overlay">
                        <div class="pg-modal pg-modal--lg player-modal">
                            <button type="button" class="pg-close player-modal__close" id="close-modal-btn" aria-label="Cerrar">${I('close')}</button>
                            <div class="player-modal__grid">
                                <div class="player-modal__visual">
                                    <span class="player-modal__num" aria-hidden="true">${player.number}</span>
                                    ${photo(player, 'player-modal__img')}
                                    <span class="player-modal__tag t-meta">Polígono Giants · Temp. 26/27</span>
                                </div>
                                <div class="player-modal__info">
                                    <div class="pg-modal__kicker">#${player.number} · ${player.position}</div>
                                    <h2 class="player-modal__name">${player.name}</h2>
                                    ${player.nickname ? `<p class="player-modal__nick">“${player.nickname}”</p>` : ''}

                                    <div class="pg-stats player-modal__stats">
                                        ${stat(pj, 'Partidos')}
                                        ${stat(st.goals || 0, 'Goles', 'pg-stat--signal')}
                                        ${stat(st.assists || 0, 'Asistencias')}
                                        ${stat(per(st.goals || 0), 'Goles / PJ')}
                                        ${stat(st.mvp || 0, 'MVP')}
                                        ${stat(per(st.assists || 0), 'Asis / PJ')}
                                    </div>

                                    <div class="player-modal__sub">
                                        <div class="pg-h"><span class="pg-h__meta">Resultados</span><span class="pg-h__meta">Tarjetas</span></div>
                                        <div class="player-modal__pair">
                                            <div class="player-modal__line t-meta">
                                                <span><b class="t-num">${st.wins || 0}</b> V</span>
                                                <span><b class="t-num">${st.draws || 0}</b> E</span>
                                                <span><b class="t-num">${st.losses || 0}</b> D</span>
                                            </div>
                                            <div class="player-modal__line t-meta">
                                                <span class="card-ct card-ct--y">${st.yellowCards || 0}</span>
                                                <span class="card-ct card-ct--b">${st.blueCards || 0}</span>
                                                <span class="card-ct card-ct--r">${st.redCards || 0}</span>
                                            </div>
                                        </div>
                                    </div>

                                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--block" id="btn-edit-player" data-player-id="${player.id}">${I('edit')} Editar ficha</button>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        return `
            <div class="pg-view">
                ${LowerThird({ page: 'squad', title: 'Plantilla', sub: `Temporada 26/27 · ${players.length} jugadores · Liga F7 Gijón` })}

                <div class="squad-toolbar">
                    <div class="pg-chips squad-filters">${filtersHtml}</div>
                </div>

                ${filtered.length ? `<div class="squad-grid">${playersHtml}</div>` : `<div class="pg-empty">Sin jugadores en esta demarcación</div>`}

                <section class="squad-ranking">
                    <div class="pg-h">
                        <h2 class="pg-h__title">Ranking</h2>
                        <span class="pg-h__meta">Toca una columna para ordenar</span>
                    </div>
                    <div class="pg-table-wrap">
                        <table class="pg-table ranking-table">
                            <thead><tr>${thead}</tr></thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </section>
            </div>
            ${modalHtml}
        `;
    },

    bindEvents() {
        // Eventos de botones de filtrado de posición
        document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeFilter = btn.getAttribute('data-filter');
                state.notify();
            });
        });

        // Eventos de click en las cabeceras de la tabla para ordenar columnas
        document.querySelectorAll('.sortable-th[data-sort]').forEach(th => {
            th.addEventListener('click', () => {
                const sortKey = th.getAttribute('data-sort');
                if (sortKey) {
                    this.rankingTab = sortKey;
                    state.notify();
                }
            });
        });

        // Evento click en tarjetas para abrir ficha
        document.querySelectorAll('.player-card-compact').forEach(el => {
            const open = (e) => {
                if (e.target.closest('.btn-quick-edit-player')) return;
                const playerId = parseInt(el.getAttribute('data-player-id'));
                if (playerId) state.update({ selectedPlayerId: playerId });
            };
            el.addEventListener('click', open);
            el.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(e); });
        });

        // Evento click directo en botón de edición rápida (Admin)
        document.querySelectorAll('.btn-quick-edit-player').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const playerId = parseInt(btn.getAttribute('data-player-id'));
                if (playerId) this.openEditPlayerModal(playerId);
            });
        });


        // Evento de cerrado del modal de jugador
        const closeBtn = document.getElementById('close-modal-btn');
        const overlay = document.getElementById('player-modal-overlay');
        const closeModal = () => state.update({ selectedPlayerId: null });

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
        }

        // Evento Editar Jugador desde Modal de Ficha (Admin)
        const btnEditPlayer = document.getElementById('btn-edit-player');
        if (btnEditPlayer) {
            btnEditPlayer.addEventListener('click', () => {
                const playerId = parseInt(btnEditPlayer.getAttribute('data-player-id'));
                closeModal();
                if (playerId) this.openEditPlayerModal(playerId);
            });
        }
    },

    openEditPlayerModal(playerId) {
        // Eliminar modales previos huérfanos del DOM
        document.querySelectorAll('#edit-player-modal-overlay').forEach(m => m.remove());

        const player = teamData.players.find(p => p.id === playerId);
        if (!player) return;

        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-overlay active';
        modalWrapper.id = 'edit-player-modal-overlay';
        modalWrapper.innerHTML = `
            <div class="pg-modal pg-modal--md">
                ${ModalHead({ kicker: 'Admin · Plantilla', title: `#${player.number} ${player.name}`, closeId: 'close-edit-player-modal' })}
                <form id="edit-player-form" class="pg-form pg-modal__body">
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="edit-p-name">Nombre completo</label><input type="text" id="edit-p-name" class="pg-input" value="${player.name}" required></div>
                        <div class="pg-field"><label class="pg-label" for="edit-p-number">Dorsal</label><input type="number" id="edit-p-number" min="1" max="99" class="pg-input" value="${player.number}" required></div>
                    </div>
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="edit-p-nickname">Apodo</label><input type="text" id="edit-p-nickname" class="pg-input" value="${player.nickname || ''}" placeholder="El Muro, El Mamba…"></div>
                        <div class="pg-field"><label class="pg-label" for="edit-p-age">Edad</label><input type="number" id="edit-p-age" min="1" max="99" class="pg-input" value="${player.info ? player.info.age : 24}" required></div>
                    </div>
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="edit-p-position">Posición en ficha</label><input type="text" id="edit-p-position" class="pg-input" value="${player.position}" placeholder="Medio / Delantero" required></div>
                        <div class="pg-field"><label class="pg-label" for="edit-p-category">Categoría (filtro)</label>
                            <select id="edit-p-category" class="pg-input">
                                ${['porteros', 'defensas', 'carrileros', 'medios', 'delanteros'].map(c => `<option value="${c}" ${player.category === c ? 'selected' : ''}>${c[0].toUpperCase() + c.slice(1)}</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="pg-field">
                        <label class="pg-label" for="edit-p-photo-file">Foto del jugador (PNG recortado)</label>
                        <input type="file" id="edit-p-photo-file" accept="image/*" class="pg-input">
                        ${player.photo ? `<span class="pg-hint">Hay una foto activa. Elige un archivo solo si quieres cambiarla.</span>` : ''}
                    </div>

                    <fieldset class="pg-fieldset">
                        <legend class="pg-label">Temporada actual · 2026/27</legend>
                        <div class="pg-form__row pg-form__row--4">
                            <div class="pg-field"><label class="pg-label" for="edit-s-matches">Partidos</label><input type="number" id="edit-s-matches" class="pg-input" value="${player.stats ? (player.stats.matches || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-wins">Victorias</label><input type="number" id="edit-s-wins" class="pg-input" value="${player.stats ? (player.stats.wins || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-draws">Empates</label><input type="number" id="edit-s-draws" class="pg-input" value="${player.stats ? (player.stats.draws || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-losses">Derrotas</label><input type="number" id="edit-s-losses" class="pg-input" value="${player.stats ? (player.stats.losses || 0) : 0}"></div>
                        </div>
                        <div class="pg-form__row pg-form__row--3">
                            <div class="pg-field"><label class="pg-label" for="edit-s-goals">Goles</label><input type="number" id="edit-s-goals" class="pg-input" value="${player.stats ? (player.stats.goals || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-assists">Asistencias</label><input type="number" id="edit-s-assists" class="pg-input" value="${player.stats ? (player.stats.assists || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-mvp">MVP</label><input type="number" id="edit-s-mvp" class="pg-input" value="${player.stats ? (player.stats.mvp || 0) : 0}"></div>
                        </div>
                        <div class="pg-form__row pg-form__row--3">
                            <div class="pg-field"><label class="pg-label" for="edit-s-yellows">Amarillas</label><input type="number" id="edit-s-yellows" class="pg-input" value="${player.stats ? (player.stats.yellowCards || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-reds">Rojas</label><input type="number" id="edit-s-reds" class="pg-input" value="${player.stats ? (player.stats.redCards || 0) : 0}"></div><div class="pg-field"><label class="pg-label" for="edit-s-blues">Azules</label><input type="number" id="edit-s-blues" class="pg-input" value="${player.stats ? (player.stats.blueCards || 0) : 0}"></div>
                        </div>
                    </fieldset>

                    <fieldset class="pg-fieldset">
                        <legend class="pg-label">Histórico en el club</legend>
                        <div class="pg-form__row pg-form__row--4">
                            <div class="pg-field"><label class="pg-label" for="edit-h-matches">PJ</label><input type="number" id="edit-h-matches" class="pg-input" value="${player.historicalStats ? player.historicalStats.matches : (player.stats?.matches || 0) + 36}"></div><div class="pg-field"><label class="pg-label" for="edit-h-goals">Goles</label><input type="number" id="edit-h-goals" class="pg-input" value="${player.historicalStats ? player.historicalStats.goals : (player.stats?.goals || 0) + 18}"></div><div class="pg-field"><label class="pg-label" for="edit-h-assists">Asist.</label><input type="number" id="edit-h-assists" class="pg-input" value="${player.historicalStats ? player.historicalStats.assists : (player.stats?.assists || 0) + 22}"></div><div class="pg-field"><label class="pg-label" for="edit-h-mvp">MVP</label><input type="number" id="edit-h-mvp" class="pg-input" value="${player.historicalStats ? (player.historicalStats.mvp || 0) : (player.stats?.mvp || 0) + 4}"></div>
                        </div>
                        <div class="pg-form__row">
                            <div class="pg-field"><label class="pg-label" for="edit-h-seasons">Temporadas</label><input type="number" id="edit-h-seasons" min="1" max="50" class="pg-input" value="${player.historicalStats ? player.historicalStats.seasons : 3}"></div>
                            <div class="pg-field"><label class="pg-label" for="edit-h-titles">Palmarés / títulos</label><input type="text" id="edit-h-titles" class="pg-input" value="${player.historicalStats ? player.historicalStats.titles : 'Copa F7 Gijón'}" placeholder="1 Copa F7 Gijón"></div>
                        </div>
                    </fieldset>

                    <div class="pg-row" style="justify-content:flex-end">
                        <button type="button" class="pg-btn" id="cancel-edit-player-btn">Cancelar</button>
                        <button type="submit" class="pg-btn pg-btn--primary">${I('check')} Guardar cambios</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalWrapper);

        const closeEditModal = () => {
            if (document.body.contains(modalWrapper)) {
                document.body.removeChild(modalWrapper);
            }
        };

        modalWrapper.querySelector('#close-edit-player-modal').addEventListener('click', closeEditModal);
        modalWrapper.querySelector('#cancel-edit-player-btn').addEventListener('click', closeEditModal);
        modalWrapper.addEventListener('click', (e) => {
            if (e.target === modalWrapper) closeEditModal();
        });

        modalWrapper.querySelector('#edit-player-form').addEventListener('submit', (ev) => {
            ev.preventDefault();

            const newName = document.getElementById('edit-p-name').value.trim();
            const newNumber = parseInt(document.getElementById('edit-p-number').value) || player.number;
            const newNickname = document.getElementById('edit-p-nickname').value.trim();
            const newAge = parseInt(document.getElementById('edit-p-age').value) || 24;
            const newPosition = document.getElementById('edit-p-position').value.trim();
            const newCategory = document.getElementById('edit-p-category').value;

            const newMatches = parseInt(document.getElementById('edit-s-matches').value) || 0;
            const newWins = parseInt(document.getElementById('edit-s-wins').value) || 0;
            const newDraws = parseInt(document.getElementById('edit-s-draws').value) || 0;
            const newLosses = parseInt(document.getElementById('edit-s-losses').value) || 0;

            const newGoals = parseInt(document.getElementById('edit-s-goals').value) || 0;
            const newAssists = parseInt(document.getElementById('edit-s-assists').value) || 0;
            const newMvp = parseInt(document.getElementById('edit-s-mvp').value) || 0;

            const newYellows = parseInt(document.getElementById('edit-s-yellows').value) || 0;
            const newReds = parseInt(document.getElementById('edit-s-reds').value) || 0;
            const newBlues = parseInt(document.getElementById('edit-s-blues').value) || 0;

            // Guardar Stats Históricas
            player.historicalStats = {
                matches: parseInt(document.getElementById('edit-h-matches').value) || 0,
                goals: parseInt(document.getElementById('edit-h-goals').value) || 0,
                assists: parseInt(document.getElementById('edit-h-assists').value) || 0,
                mvp: parseInt(document.getElementById('edit-h-mvp').value) || 0,
                seasons: parseInt(document.getElementById('edit-h-seasons').value) || 1,
                titles: document.getElementById('edit-h-titles').value.trim() || 'Copa F7 Gijón'
            };

            const applyFormSave = () => {
                player.name = newName || player.name;
                player.number = newNumber;
                player.nickname = newNickname;
                player.position = newPosition || player.position;
                player.category = newCategory || player.category;

                player.info = player.info || {};
                player.info.age = newAge;

                player.stats = player.stats || {};
                player.stats.matches = newMatches;
                player.stats.wins = newWins;
                player.stats.draws = newDraws;
                player.stats.losses = newLosses;
                player.stats.goals = newGoals;
                player.stats.assists = newAssists;
                player.stats.mvp = newMvp;
                player.stats.yellowCards = newYellows;
                player.stats.redCards = newReds;
                player.stats.blueCards = newBlues;

                savePlayersToStorage();
                closeEditModal();
                state.notify();
            };

            const photoFile = document.getElementById('edit-p-photo-file');
            if (photoFile && photoFile.files && photoFile.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    player.photo = e.target.result;
                    applyFormSave();
                };
                reader.readAsDataURL(photoFile.files[0]);
            } else {
                applyFormSave();
            }
        });
    }
};
