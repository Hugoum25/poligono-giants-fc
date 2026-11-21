/* ==========================================
   FC HUB - GENERADOR DE IMÁGENES PARA REDES SOCIALES (IG)
   PESTAÑAS: CONVOCATORIA & RESULTADO (EXCLUSIVO ADMINISTRADORES)
   ========================================== */

import { state } from '../state.js';
import { teamData, getRivalCrest } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { ClubLogo } from './ClubLogo.js';
import { I } from './Icons.js';
import { LowerThird, sponsorLogoSrc, initials } from './ui.js';

export const LineupView = {
    activeIgTab: "convocatoria", // "convocatoria" | "resultado"
    activeFormation: "3-2-1",
    matchTitle: "vs. Sporting La Camocha F7",
    competitionTitle: "Liga F7 Gijón - Jornada 12",
    matchDateTime: "Sábado 18:00h | Campo Municipal La Camocha",
    selectedSlotForSwap: null,

    // Estado del resultado
    selectedMatchId: null,
    resultScoreLocal: 4,
    resultScoreVisitor: 2,
    resultScorers: {
        6: 2, // Rubén Montes 2 goles
        7: 2  // Rodrigo Cuesta 2 goles
    },
    resultAssists: {
        5: 2, // Dario Álvarez 2 asistencias
        2: 1  // Javier Chimeno 1 asistencia
    },

    lineup: {
        gk: 1,
        def1: 2,
        def2: 3,
        def3: 4,
        mid1: 5,
        mid2: 6,
        fwd1: 7,
        bench1: 8,
        bench2: 9,
        bench3: 10,
        bench4: 11,
        bench5: 12
    },

    getFormations() {
        return {
            "3-2-1": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "CARR.IZQ", row: 3, col: 1 },
                { id: "def2", label: "CENTRAL", row: 3, col: 2 },
                { id: "def3", label: "CARR.DER", row: 3, col: 3 },
                { id: "mid1", label: "MEDIO", row: 2, col: 1 },
                { id: "mid2", label: "MEDIO", row: 2, col: 3 },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2 }
            ],
            "2-3-1": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1 },
                { id: "def2", label: "DEF.DER", row: 3, col: 3 },
                { id: "mid1", label: "BANDA.IZQ", row: 2, col: 1 },
                { id: "def3", label: "PIVOTE", row: 2, col: 2 },
                { id: "mid2", label: "BANDA.DER", row: 2, col: 3 },
                { id: "fwd1", label: "DELANTERO", row: 1, col: 2 }
            ],
            "2-2-2": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "DEF.IZQ", row: 3, col: 1 },
                { id: "def2", label: "DEF.DER", row: 3, col: 3 },
                { id: "mid1", label: "MED.IZQ", row: 2, col: 1 },
                { id: "mid2", label: "MED.DER", row: 2, col: 3 },
                { id: "def3", label: "DEL.IZQ", row: 1, col: 1 },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3 }
            ],
            "3-1-2": [
                { id: "gk", label: "POR", row: 4, col: 2 },
                { id: "def1", label: "CARR.IZQ", row: 3, col: 1 },
                { id: "def2", label: "CENTRAL", row: 3, col: 2 },
                { id: "def3", label: "CARR.DER", row: 3, col: 3 },
                { id: "mid1", label: "MEDIO", row: 2, col: 2 },
                { id: "mid2", label: "DEL.IZQ", row: 1, col: 1 },
                { id: "fwd1", label: "DEL.DER", row: 1, col: 3 }
            ]
        };
    },

    autoFillStarter() {
        const available = [...teamData.players];
        const assigned = new Set();

        const findByPos = (keyword) => {
            const found = available.find(p => !assigned.has(p.id) && p.position && p.position.toLowerCase().includes(keyword.toLowerCase()));
            if (found) assigned.add(found.id);
            return found ? found.id : null;
        };

        this.lineup.gk = findByPos('Portero') || available[0]?.id || null;
        this.lineup.def1 = findByPos('Defensa') || findByPos('Cierre') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def1) assigned.add(this.lineup.def1);

        this.lineup.def2 = findByPos('Defensa') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def2) assigned.add(this.lineup.def2);

        this.lineup.def3 = findByPos('Defensa') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.def3) assigned.add(this.lineup.def3);

        this.lineup.mid1 = findByPos('Medio') || findByPos('Ala') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.mid1) assigned.add(this.lineup.mid1);

        this.lineup.mid2 = findByPos('Medio') || findByPos('Ala') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.mid2) assigned.add(this.lineup.mid2);

        this.lineup.fwd1 = findByPos('Delantero') || findByPos('Pívot') || available.find(p => !assigned.has(p.id))?.id || null;
        if (this.lineup.fwd1) assigned.add(this.lineup.fwd1);

        const benchKeys = ['bench1', 'bench2', 'bench3', 'bench4', 'bench5'];
        benchKeys.forEach(k => {
            const nextP = available.find(p => !assigned.has(p.id));
            if (nextP) {
                this.lineup[k] = nextP.id;
                assigned.add(nextP.id);
            } else {
                this.lineup[k] = null;
            }
        });
    },

    assignPlayer(playerId) {
        if (Object.values(this.lineup).includes(playerId)) return;
        const keys = ['gk', 'def1', 'def2', 'def3', 'mid1', 'mid2', 'fwd1', 'bench1', 'bench2', 'bench3', 'bench4', 'bench5'];
        const emptyKey = keys.find(k => !this.lineup[k]);
        if (emptyKey) {
            this.lineup[emptyKey] = playerId;
        }
    },

    unassignPlayer(playerId) {
        Object.keys(this.lineup).forEach(k => {
            if (this.lineup[k] === playerId) {
                this.lineup[k] = null;
            }
        });
    },

    render() {
        if (!AuthService.isAdmin()) {
            return `
                <div class="pg-view">
                    <div class="pg-empty">${I('lock', 'pg-ico--lg')}<br>Acceso restringido · Generador IG solo para administradores</div>
                </div>
            `;
        }

        const defaultTeams = [
            "Feleches-Barciastur-Pesa", "Aston Birra", "At. Pinzales", "Pates Arriba", "La Samba Del Patio",
            "Inter de Gijón", "Club Atlético Zarracina", "Pinturas Rubén", "Mesón el Refugio", 'Forum-Podoxana "A"',
            "Sidrería el Tendido", "Galácticos F7", "Sporting La Camocha F7", "La Calzada F7", "Rayo Gijonés", "Atlético Cimavilla"
        ];
        const allOpponents = Array.from(new Set([
            ...defaultTeams,
            ...(teamData.matches || []).map(m => m.opponent).filter(Boolean)
        ])).sort();

        const opponentOptionsHtml = allOpponents.map(team => {
            const isSelected = this.selectedOpponent ? (this.selectedOpponent === team) : (this.matchTitle.includes(team));
            return `<option value="${team}" ${isSelected ? 'selected' : ''}>vs. ${team}</option>`;
        }).join('');

        const jornadaList = Array.from({ length: 26 }, (_, i) => `Jornada ${i + 1}`);
        const currentJornadaVal = this.selectedJornada || (this.competitionTitle.replace(/^Liga\s*F7\s*Gijón\s*-\s*/i, '').trim()) || 'Jornada 12';
        const jornadaOptionsHtml = jornadaList.map(j => `<option value="${j}" ${currentJornadaVal.toLowerCase() === j.toLowerCase() ? 'selected' : ''}>${j}</option>`).join('');

        const opponentName = (this.selectedOpponent || this.matchTitle.replace(/^vs\.\s*/i, '')).trim();
        const jornadaText = currentJornadaVal;
        const jNum = (jornadaText.match(/\d+/) || [''])[0];
        const rivalCrest = getRivalCrest(opponentName);

        // Patrocinadores para los carteles (sin fusiones: html2canvas no soporta blend modes)
        const sponsorStrip = `
            <div class="ig-sponsors">
                ${(teamData.sponsors || []).map(sp => {
                    const src = sponsorLogoSrc(sp);
                    return src ? `<img src="${src}" alt="${sp.name}" />` : `<span class="ig-a">${sp.name}</span>`;
                }).join('')}
            </div>`;

        const token = (player, label, swap, small = false) => `
            <div class="ig-token ${small ? 'ig-token--sm' : ''} ${swap ? 'is-swap' : ''} ${player ? '' : 'is-empty'}">
                <div class="ig-token__disc">
                    ${player
                        ? (player.photo ? `<img src="${player.photo}" alt="" />` : `<span class="ig-token__initials ig-a">${initials(player.name).slice(0, 2)}</span>`)
                        : `<span class="ig-token__label">${label || ''}</span>`}
                    ${player ? `<span class="ig-token__num"><span class="ig-a">${player.number}</span></span>` : ''}
                </div>
                ${player ? `<div class="ig-token__name ig-a">${player.name.split(' ')[0]}</div>` : ''}
            </div>`;

        let controlsHtml = '';
        let cardHtml = '';
        let actionLabel = '';

        if (this.activeIgTab === 'convocatoria') {
            actionLabel = 'Generar convocatoria';
            const assignedPlayerIds = Object.values(this.lineup).filter(Boolean);
            const currentSlots = this.getFormations()[this.activeFormation] || this.getFormations()["3-2-1"];
            const sortedPlayers = [...teamData.players].sort((a, b) => a.number - b.number);

            const checkboxListHtml = sortedPlayers.map(p => {
                const isChecked = assignedPlayerIds.includes(p.id);
                const slotKey = isChecked ? Object.keys(this.lineup).find(k => this.lineup[k] === p.id) : null;
                const role = slotKey ? (slotKey.startsWith('bench') ? 'S' : 'T') : '';
                return `
                    <label class="ig-check ${isChecked ? 'is-on' : ''}">
                        <input type="checkbox" class="lineup-player-checkbox" data-player-id="${p.id}" ${isChecked ? 'checked' : ''} />
                        <span class="ig-check__num">${p.number}</span>
                        <span class="ig-check__name">${p.name}</span>
                        ${role ? `<span class="ig-check__role ${role === 'T' ? 'is-t' : ''}">${role}</span>` : ''}
                    </label>
                `;
            }).join('');

            const pitchSlotsHtml = currentSlots.map(slot => {
                const pid = this.lineup[slot.id];
                const player = pid ? teamData.players.find(p => p.id === pid) : null;
                return `
                    <div class="pitch-slot ${player ? 'occupied' : 'empty'}" draggable="${!!player}" data-slot-id="${slot.id}" style="grid-row:${slot.row};grid-column:${slot.col}">
                        ${token(player, slot.label, this.selectedSlotForSwap === slot.id)}
                    </div>
                `;
            }).join('');

            const bench = ['bench1', 'bench2', 'bench3', 'bench4', 'bench5']
                .map(id => ({ id, player: this.lineup[id] ? teamData.players.find(p => p.id === this.lineup[id]) : null }))
                .filter(b => b.player);
            const benchHtml = bench.map(({ id, player }) => `
                <div class="bench-slot occupied" draggable="true" data-slot-id="${id}">
                    ${token(player, '', this.selectedSlotForSwap === id, true)}
                </div>
            `).join('');

            controlsHtml = `
                <section class="ig-panel">
                    <h3 class="ig-panel__title">Datos del partido</h3>
                    <div class="pg-form">
                        <div class="pg-field"><label class="pg-label" for="select-opponent">Rival</label><select id="select-opponent" class="pg-input">${opponentOptionsHtml}</select></div>
                        <div class="pg-field"><label class="pg-label" for="select-jornada">Jornada</label><select id="select-jornada" class="pg-input">${jornadaOptionsHtml}</select></div>
                        <div class="pg-field"><label class="pg-label" for="input-datetime">Fecha, hora y campo</label><input type="text" id="input-datetime" class="pg-input" value="${this.matchDateTime}"></div>
                        <div class="pg-field">
                            <span class="pg-label">Formación</span>
                            <div class="ig-formations">
                                ${['3-2-1', '2-3-1', '2-2-2', '3-1-2'].map(f => `<button type="button" class="pg-chip formation-btn ${this.activeFormation === f ? 'is-active' : ''}" data-formation="${f}">${f}</button>`).join('')}
                            </div>
                        </div>
                    </div>
                </section>
                <section class="ig-panel">
                    <div class="ig-panel__head">
                        <h3 class="ig-panel__title">Convocatoria</h3>
                        <span class="t-meta"><b class="t-signal">${assignedPlayerIds.length}</b> / 12</span>
                    </div>
                    <div class="ig-checks">${checkboxListHtml}</div>
                    <p class="pg-hint ig-hint">Toca dos jugadores en el cartel (o arrástralos) para intercambiarlos.</p>
                    <button type="button" class="pg-btn pg-btn--sm pg-btn--block" id="btn-reset-lineup">${I('trash')} Vaciar convocatoria</button>
                </section>
            `;

            cardHtml = `
                <div id="social-lineup-card" class="ig-card ig-card--lineup">
                    <div class="ig-card__top">
                        <span class="ig-card__kicker ig-a">Convocatoria</span>
                        <span class="ig-card__j ig-a">J${jNum}</span>
                    </div>
                    <div class="ig-card__match">
                        <div class="ig-card__club">${ClubLogo.render(44)}<span class="ig-a">Polígono Giants</span></div>
                        <span class="ig-card__vs ig-a">vs</span>
                        <div class="ig-card__club ig-card__club--away">
                            ${rivalCrest ? `<img src="${rivalCrest}" alt="" class="ig-card__crest" />` : ''}
                            <span class="ig-a">${opponentName}</span>
                        </div>
                    </div>
                    <div id="ig-card-datetime-display" class="ig-card__meta">${this.matchDateTime || 'SÁBADO 19:00 - CAMPO LOCAL'}</div>

                    <div class="ig-pitch">
                        <div class="ig-pitch__lines">
                            <span class="ig-pitch__half"></span><span class="ig-pitch__circle"></span>
                            <span class="ig-pitch__box ig-pitch__box--top"></span><span class="ig-pitch__box ig-pitch__box--bottom"></span>
                        </div>
                        <div class="ig-pitch__grid">${pitchSlotsHtml}</div>
                    </div>

                    ${bench.length ? `<div class="ig-bench"><span class="ig-bench__label">Banquillo</span><div class="ig-bench__row">${benchHtml}</div></div>` : ''}

                    ${sponsorStrip}
                    <div class="ig-card__tag ig-a">#AguantePoligono</div>
                </div>
            `;
        } else {
            actionLabel = 'Generar resultado';
            const finishedMatches = (teamData.matches || []).filter(m => m.type === 'past' || (m.goalsGiants !== null && m.goalsGiants !== undefined));
            const finishedMatchOptionsHtml = finishedMatches.map(m => `<option value="${m.id}" ${this.selectedMatchId === m.id ? 'selected' : ''}>${m.competition} · vs ${m.opponent} (${m.goalsGiants}–${m.goalsOpponent})</option>`).join('');

            const outcome = this.resultScoreLocal > this.resultScoreVisitor ? 'Victoria' : this.resultScoreLocal === this.resultScoreVisitor ? 'Empate' : 'Derrota';
            const sortedPlayers = [...teamData.players].sort((a, b) => a.number - b.number);
            const counter = (cls, pid, val, label) => `
                <div class="ig-counter">
                    <span class="t-meta">${label}</span>
                    <button type="button" class="pg-btn pg-btn--icon pg-btn--xs ${cls}-minus" data-player-id="${pid}" aria-label="Restar">−</button>
                    <span class="ig-counter__val ${val > 0 ? 'is-on' : ''}">${val}</span>
                    <button type="button" class="pg-btn pg-btn--icon pg-btn--xs ${cls}-plus" data-player-id="${pid}" aria-label="Sumar">+</button>
                </div>`;
            const statsControlHtml = sortedPlayers.map(p => `
                <div class="ig-stat-row">
                    <span class="ig-check__num">${p.number}</span>
                    <span class="ig-check__name">${p.name}</span>
                    ${counter('btn-scorer', p.id, this.resultScorers[p.id] || 0, 'G')}
                    ${counter('btn-assist', p.id, this.resultAssists[p.id] || 0, 'A')}
                </div>
            `).join('');

            const scorersSlashText = Object.keys(this.resultScorers)
                .filter(id => this.resultScorers[id] > 0)
                .map(id => {
                    const player = teamData.players.find(p => p.id === parseInt(id));
                    if (!player) return null;
                    const count = this.resultScorers[id];
                    const firstName = player.name.split(' ')[0].toUpperCase();
                    return count > 1 ? `${firstName} (${count})` : firstName;
                })
                .filter(Boolean)
                .join(' / ');

            controlsHtml = `
                <section class="ig-panel">
                    <h3 class="ig-panel__title">Partido</h3>
                    <div class="pg-form">
                        <div class="pg-field">
                            <label class="pg-label" for="select-finished-match">Partido disputado</label>
                            <select id="select-finished-match" class="pg-input">
                                <option value="custom">Partido personalizado</option>
                                ${finishedMatchOptionsHtml}
                            </select>
                        </div>
                        <div class="pg-form__row">
                            <div class="pg-field"><label class="pg-label" for="input-result-score-local">Giants</label><input type="number" id="input-result-score-local" class="pg-input ig-score-input" min="0" max="99" value="${this.resultScoreLocal}"></div>
                            <div class="pg-field"><label class="pg-label" for="input-result-score-visitor">Rival</label><input type="number" id="input-result-score-visitor" class="pg-input ig-score-input" min="0" max="99" value="${this.resultScoreVisitor}"></div>
                        </div>
                        <span class="pg-badge pg-badge--${outcome === 'Victoria' ? 'win' : outcome === 'Empate' ? 'draw' : 'loss'}">${outcome}</span>
                    </div>
                </section>
                <section class="ig-panel">
                    <h3 class="ig-panel__title">Goles y asistencias</h3>
                    <div class="ig-stats">${statsControlHtml}</div>
                </section>
            `;

            cardHtml = `
                <div id="social-result-card" class="ig-card ig-card--result">
                    <div class="ig-card__top">
                        <span class="ig-card__kicker ig-a">Final del partido</span>
                        <span class="ig-card__j ig-a">J${jNum}</span>
                    </div>
                    <div class="ig-result">
                        <div class="ig-result__crests">
                            ${ClubLogo.render(104)}
                            ${rivalCrest ? `<img src="${rivalCrest}" alt="" class="ig-result__crest" />` : `<span class="ig-result__crest ig-result__crest--text"><span class="ig-a">${initials(opponentName)}</span></span>`}
                        </div>
                        <div class="ig-result__score ig-a">${this.resultScoreLocal}<span>–</span>${this.resultScoreVisitor}</div>
                        <div class="ig-result__teams ig-a">Polígono Giants <span>vs</span> ${opponentName}</div>
                        ${scorersSlashText ? `<div class="ig-result__scorers">Goles · ${scorersSlashText}</div>` : ''}
                    </div>
                    <div class="ig-card__meta ig-card__meta--result">${(jornadaText || 'Jornada').toUpperCase()} · LIGA F7 GIJÓN</div>
                    ${sponsorStrip}
                    <div class="ig-card__tag ig-a">#AguantePoligono</div>
                </div>
            `;
        }

        return `
            <div class="pg-view pg-view--wide">
                ${LowerThird({ page: 'lineup', title: 'Generador IG', sub: 'Carteles para redes · Exporta PNG en alta resolución' })}

                <div class="pg-tabs ig-tabs" role="tablist">
                    <button type="button" role="tab" class="pg-tab ${this.activeIgTab === 'convocatoria' ? 'is-active' : ''}" id="ig-subtab-convocatoria">Convocatoria</button>
                    <button type="button" role="tab" class="pg-tab ${this.activeIgTab === 'resultado' ? 'is-active' : ''}" id="ig-subtab-resultado">Resultado</button>
                </div>

                <div class="social-lineup-layout">
                    <div class="ig-controls">${controlsHtml}</div>
                    <div class="ig-stage">
                        <div class="ig-stage__frame">${cardHtml}</div>
                        <button type="button" class="pg-btn pg-btn--primary ig-stage__cta" id="btn-download-social-card">${I('download')} ${actionLabel}</button>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        if (!AuthService.isAdmin()) return;

        const btnTabConvocatoria = document.getElementById('ig-subtab-convocatoria');
        const btnTabResultado = document.getElementById('ig-subtab-resultado');

        if (btnTabConvocatoria) {
            btnTabConvocatoria.onclick = () => {
                this.activeIgTab = "convocatoria";
                state.notify();
            };
        }
        if (btnTabResultado) {
            btnTabResultado.onclick = () => {
                this.activeIgTab = "resultado";
                state.notify();
            };
        }

        // --- EVENTOS PESTAÑA CONVOCATORIA ---
        if (this.activeIgTab === 'convocatoria') {
            const selectOpponent = document.getElementById('select-opponent');
            if (selectOpponent) {
                selectOpponent.onchange = (e) => {
                    this.selectedOpponent = e.target.value;
                    this.matchTitle = "vs. " + e.target.value;
                    state.notify();
                };
            }

            const selectJornada = document.getElementById('select-jornada');
            if (selectJornada) {
                selectJornada.onchange = (e) => {
                    this.selectedJornada = e.target.value;
                    this.competitionTitle = "Liga F7 Gijón - " + e.target.value;
                    state.notify();
                };
            }

            const inputDateTime = document.getElementById('input-datetime');
            if (inputDateTime) {
                inputDateTime.oninput = (e) => {
                    this.matchDateTime = e.target.value;
                    const displayEl = document.getElementById('ig-card-datetime-display');
                    if (displayEl) {
                        displayEl.textContent = e.target.value.trim() !== '' ? e.target.value : 'SÁBADO 19:00 - CAMPO LOCAL';
                    }
                };
            }

            const btnAutoFill = document.getElementById('btn-autofill-lineup');
            if (btnAutoFill) {
                btnAutoFill.onclick = () => {
                    this.autoFillStarter();
                    state.notify();
                };
            }

            const btnReset = document.getElementById('btn-reset-lineup');
            if (btnReset) {
                btnReset.onclick = () => {
                    Object.keys(this.lineup).forEach(k => this.lineup[k] = null);
                    state.notify();
                };
            }

            document.querySelectorAll('.formation-btn[data-formation]').forEach(btn => {
                btn.onclick = () => {
                    this.activeFormation = btn.getAttribute('data-formation');
                    state.notify();
                };
            });

            document.querySelectorAll('.lineup-player-checkbox').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const pid = parseInt(chk.getAttribute('data-player-id'));
                    if (e.target.checked) {
                        this.assignPlayer(pid);
                    } else {
                        this.unassignPlayer(pid);
                    }
                    state.notify();
                });
            });

            let draggedSourceSlotId = null;

            document.querySelectorAll('.pitch-slot, .bench-slot').forEach(slot => {
                const slotId = slot.getAttribute('data-slot-id');

                slot.addEventListener('click', (e) => {
                    if (!this.selectedSlotForSwap) {
                        if (this.lineup[slotId]) {
                            this.selectedSlotForSwap = slotId;
                            state.notify();
                        }
                    } else if (this.selectedSlotForSwap === slotId) {
                        this.selectedSlotForSwap = null;
                        state.notify();
                    } else {
                        const sourceSlot = this.selectedSlotForSwap;
                        const targetSlot = slotId;

                        const temp = this.lineup[sourceSlot];
                        this.lineup[sourceSlot] = this.lineup[targetSlot];
                        this.lineup[targetSlot] = temp;

                        this.selectedSlotForSwap = null;
                        state.notify();
                    }
                });

                slot.addEventListener('dragstart', (e) => {
                    if (this.lineup[slotId]) {
                        draggedSourceSlotId = slotId;
                        e.dataTransfer.setData('text/plain', slotId);
                        e.dataTransfer.effectAllowed = 'move';
                    }
                });

                slot.addEventListener('dragover', (e) => {
                    if (draggedSourceSlotId) {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = 'move';
                    }
                });

                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const sourceSlotId = draggedSourceSlotId || e.dataTransfer.getData('text/plain');
                    const targetSlotId = slot.getAttribute('data-slot-id');

                    if (sourceSlotId && targetSlotId && sourceSlotId !== targetSlotId) {
                        const temp = this.lineup[sourceSlotId];
                        this.lineup[sourceSlotId] = this.lineup[targetSlotId];
                        this.lineup[targetSlotId] = temp;

                        draggedSourceSlotId = null;
                        this.selectedSlotForSwap = null;
                        state.notify();
                    }
                });
            });
        }

        // --- EVENTOS PESTAÑA RESULTADO ---
        if (this.activeIgTab === 'resultado') {
            const selectFinMatch = document.getElementById('select-finished-match');
            if (selectFinMatch) {
                selectFinMatch.onchange = (e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                        this.selectedMatchId = null;
                    } else {
                        const mId = parseInt(val);
                        const match = (teamData.matches || []).find(m => m.id === mId);
                        if (match) {
                            this.selectedMatchId = mId;
                            this.resultScoreLocal = match.goalsGiants ?? 3;
                            this.resultScoreVisitor = match.goalsOpponent ?? 1;
                            this.selectedOpponent = match.opponent;
                            this.matchTitle = "vs. " + match.opponent;
                            this.selectedJornada = match.competition.replace(/^Liga\s*F7\s*Gijón\s*-\s*/i, '').trim();

                            // Cargar goleadores y asistencias del partido seleccionado
                            this.resultScorers = {};
                            if (Array.isArray(match.scorers)) {
                                match.scorers.forEach(s => {
                                    this.resultScorers[s.playerId] = s.goals;
                                });
                            }

                            this.resultAssists = {};
                            if (Array.isArray(match.assists)) {
                                match.assists.forEach(a => {
                                    this.resultAssists[a.playerId] = a.assists;
                                });
                            }
                        }
                    }
                    state.notify();
                };
            }

            const inputResLocal = document.getElementById('input-result-score-local');
            if (inputResLocal) {
                inputResLocal.oninput = (e) => {
                    this.resultScoreLocal = Math.max(0, parseInt(e.target.value) || 0);
                    state.notify();
                };
            }

            const inputResVisitor = document.getElementById('input-result-score-visitor');
            if (inputResVisitor) {
                inputResVisitor.oninput = (e) => {
                    this.resultScoreVisitor = Math.max(0, parseInt(e.target.value) || 0);
                    state.notify();
                };
            }

            // Goleadores (+ / -)
            document.querySelectorAll('.btn-scorer-plus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    this.resultScorers[pid] = (this.resultScorers[pid] || 0) + 1;
                    state.notify();
                };
            });

            document.querySelectorAll('.btn-scorer-minus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    if (this.resultScorers[pid] > 0) {
                        this.resultScorers[pid]--;
                        if (this.resultScorers[pid] === 0) delete this.resultScorers[pid];
                        state.notify();
                    }
                };
            });

            // Asistencias (+ / -)
            document.querySelectorAll('.btn-assist-plus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    this.resultAssists[pid] = (this.resultAssists[pid] || 0) + 1;
                    state.notify();
                };
            });

            document.querySelectorAll('.btn-assist-minus').forEach(btn => {
                btn.onclick = () => {
                    const pid = parseInt(btn.getAttribute('data-player-id'));
                    if (this.resultAssists[pid] > 0) {
                        this.resultAssists[pid]--;
                        if (this.resultAssists[pid] === 0) delete this.resultAssists[pid];
                        state.notify();
                    }
                };
            });
        }

        // BOTÓN COMÚN DESCARGAR IMAGEN HD
        const btnDownload = document.getElementById('btn-download-social-card');
        if (btnDownload) {
            btnDownload.onclick = () => {
                const targetCardId = this.activeIgTab === 'resultado' ? 'social-result-card' : 'social-lineup-card';
                const cardEl = document.getElementById(targetCardId);
                if (!cardEl) return;

                if (typeof window.html2canvas !== 'function') {
                    alert("La librería de exportación de imagen aún está cargando. Por favor, reintenta en un momento.");
                    return;
                }

                const actionLabel = this.activeIgTab === 'resultado' ? 'Resultado' : 'Convocatoria';
                const bg = this.activeIgTab === 'resultado' ? '#ff2a85' : '#0a0a0b';
                const originalHtml = btnDownload.innerHTML;
                btnDownload.textContent = `Generando ${actionLabel.toLowerCase()}…`;
                btnDownload.disabled = true;

                // Medir dimensiones exactas en pantalla
                const actualWidth = cardEl.offsetWidth || 540;
                const actualHeight = cardEl.offsetHeight;

                // Crear contenedor aislado fuera de la pantalla en document.body con alto y ancho proporcionales exactos
                const offscreenContainer = document.createElement('div');
                offscreenContainer.style.position = 'fixed';
                offscreenContainer.style.left = '-9999px';
                offscreenContainer.style.top = '0';
                offscreenContainer.style.width = actualWidth + 'px';
                offscreenContainer.style.height = actualHeight + 'px';
                offscreenContainer.style.zIndex = '-99999';
                offscreenContainer.style.background = bg;
                offscreenContainer.style.overflow = 'hidden';

                const cloneCard = cardEl.cloneNode(true);
                cloneCard.style.width = actualWidth + 'px';
                cloneCard.style.height = actualHeight + 'px';
                cloneCard.style.maxWidth = 'none';
                cloneCard.style.margin = '0';
                cloneCard.style.transform = 'none';
                cloneCard.style.boxSizing = 'border-box';

                offscreenContainer.appendChild(cloneCard);
                document.body.appendChild(offscreenContainer);

                window.html2canvas(cloneCard, {
                    scale: 2.5,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: bg,
                    width: actualWidth,
                    height: actualHeight,
                    logging: false,
                    // Esperar a las fuentes del iframe clonado: si no, Anton se mide con métricas de reserva y el texto baja
                    onclone: (doc) => {
                        // html2canvas dibuja Anton ~0,34em por debajo de su sitio: se compensa solo en el clon
                        doc.querySelectorAll('.ig-card').forEach(el => el.classList.add('is-export'));
                        return doc.fonts
                            ? Promise.all(['40px Anton', '12px "JetBrains Mono"', '16px Archivo'].map(f => doc.fonts.load(f).catch(() => null))).then(() => doc.fonts.ready)
                            : null;
                    }
                }).then(canvas => {
                    if (document.body.contains(offscreenContainer)) {
                        document.body.removeChild(offscreenContainer);
                    }

                    const link = document.createElement('a');
                    link.download = `${actionLabel}_Poligono_Giants_${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png', 1.0);
                    link.click();

                    btnDownload.innerHTML = originalHtml;
                    btnDownload.disabled = false;
                }).catch(err => {
                    if (document.body.contains(offscreenContainer)) {
                        document.body.removeChild(offscreenContainer);
                    }
                    console.error("Error al exportar imagen:", err);
                    alert("No se pudo generar la imagen. Intenta de nuevo.");
                    btnDownload.innerHTML = originalHtml;
                    btnDownload.disabled = false;
                });
            };
        }
    }
};
