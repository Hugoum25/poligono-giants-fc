import { state } from '../state.js';
import { teamData, saveMatchesToStorage, savePlayersToStorage, getRivalCrest } from '../data/teamData.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead, Crest } from './ui.js';

// Helper para formatear fecha en español y calcular tiempo restante desde SYSDATE (Date.now())
export function formatMatchDateAndCountdown(dateStr) {
    if (!dateStr) return { formattedDate: 'Por determinar', countdownStr: '', days: 0, hoursLeft: 0, isFuture: false };

    let matchDate;
    if (dateStr.includes('-') || dateStr.includes('T')) {
        matchDate = new Date(dateStr);
    } else {
        return { formattedDate: dateStr, countdownStr: '', days: 0, hoursLeft: 0, isFuture: false };
    }

    if (isNaN(matchDate.getTime())) {
        return { formattedDate: dateStr, countdownStr: '', days: 0, hoursLeft: 0, isFuture: false };
    }

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const day = matchDate.getDate();
    const monthName = months[matchDate.getMonth()];
    const formattedDate = `${day} de ${monthName}`;

    const now = new Date();
    const diffMs = matchDate.getTime() - now.getTime();

    let countdownStr = '';
    let days = 0;
    let hoursLeft = 0;
    let isFuture = false;

    if (diffMs > 0) {
        isFuture = true;
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        days = Math.floor(totalMinutes / (60 * 24));
        hoursLeft = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minsLeft = totalMinutes % 60;

        if (days > 0) {
            countdownStr = `${days}d ${hoursLeft}h`;
        } else if (hoursLeft > 0) {
            countdownStr = `${hoursLeft}h ${minsLeft}m`;
        } else {
            countdownStr = `${minsLeft}m`;
        }
    } else {
        countdownStr = 'Finalizado';
    }

    return { formattedDate, countdownStr, days, hoursLeft, isFuture };
}

export const MatchesView = {
    render() {
        const isAdmin = AuthService.isAdmin();
        const club = teamData.clubName;
        const matches = teamData.matches || [];
        const hasScore = m => m.ourScore !== undefined && m.ourScore !== null && m.opponentScore !== undefined && m.opponentScore !== null;
        const result = m => !hasScore(m) ? '' : m.ourScore > m.opponentScore ? 'win' : m.ourScore < m.opponentScore ? 'loss' : 'draw';
        const RESULT_LABEL = { win: 'V', loss: 'D', draw: 'E' };

        const jornadaOf = (m, i) => {
            const hit = (m.competition || '').match(/Jornada\s*(\d+)/i);
            if (hit) return hit[1];
            if (m.jornada) return m.jornada;
            return i + 1;
        };
        const timeOf = str => {
            const d = new Date(str);
            return isNaN(d) ? '' : `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        };
        const rival = (name, size) => Crest(getRivalCrest(name), name, size);

        const played = matches.filter(hasScore);
        const record = ['win', 'draw', 'loss'].map(r => played.filter(m => result(m) === r).length);

        const SHORT_M = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
        const shortDate = str => {
            const d = new Date(str);
            return isNaN(d) ? (str || 'Por confirmar') : `${String(d.getDate()).padStart(2, '0')} ${SHORT_M[d.getMonth()]}`;
        };

        const rowsHtml = matches.map((m, i) => {
            const r = result(m);
            const formattedDate = shortDate(m.date);
            return `
                <li class="match-row match-toggle-card ${r ? 'match-' + r : 'is-upcoming'}" data-match-id="${m.id}" role="button" tabindex="0">
                    <div class="match-row__when">
                        <span class="match-row__j">J${String(jornadaOf(m, i)).padStart(2, '0')}</span>
                        <span class="t-meta">${formattedDate}${timeOf(m.date) ? ' · ' + timeOf(m.date) : ''}</span>
                    </div>
                    <div class="match-row__team match-row__team--home">
                        <span class="match-row__name">${club}</span>
                        ${ClubLogo.render(24)}
                    </div>
                    <div class="match-row__score">
                        ${hasScore(m) ? `<span class="t-num">${m.ourScore}</span><span class="match-row__dash">–</span><span class="t-num">${m.opponentScore}</span>` : `<span class="match-row__vs">VS</span>`}
                    </div>
                    <div class="match-row__team">
                        ${rival(m.opponent, 'sm')}
                        <span class="match-row__name">${m.opponent}</span>
                    </div>
                    <div class="match-row__tail">
                        ${r ? `<span class="pg-badge pg-badge--${r}">${RESULT_LABEL[r]}</span>` : `<span class="t-meta">${m.stadium || ''}</span>`}
                        ${isAdmin ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs btn-edit-match-direct" data-match-id="${m.id}" title="Editar partido" aria-label="Editar partido">${I('edit')}</button>` : ''}
                    </div>
                </li>
            `;
        }).join('');

        const standingsRows = (teamData.standings || []).map(row => {
            const us = row.name === club;
            return `
                <tr class="${us ? 'is-us' : ''}">
                    <td class="st-rank">${String(row.rank).padStart(2, '0')}</td>
                    <td><span class="st-team">${us ? ClubLogo.render(20) : rival(row.name, 'sm')}<span>${row.name}</span></span></td>
                    <td class="is-num">${row.played}</td>
                    <td class="is-num">${row.wins}</td>
                    <td class="is-num">${row.draws}</td>
                    <td class="is-num">${row.losses}</td>
                    <td class="is-num t-mute">${row.goalsDiff >= 0 ? '+' + row.goalsDiff : row.goalsDiff}</td>
                    <td class="is-num st-pts">${row.points}</td>
                </tr>
            `;
        }).join('');

        const now = Date.now();
        const nextMatch = matches.find(m => !hasScore(m) && new Date(m.date).getTime() > now) || matches.find(m => !hasScore(m));
        let heroHtml = '';
        if (nextMatch) {
            const info = formatMatchDateAndCountdown(nextMatch.date);
            const idx = matches.indexOf(nextMatch);
            const banner = info.isFuture
                ? `Preparen las palomitas: quedan ${info.days === 1 ? '1 día' : info.days + ' días'} y ${info.hoursLeft === 1 ? '1 hora' : info.hoursLeft + ' horas'}.`
                : 'Preparen las palomitas: este partido se juega muy pronto.';
            heroHtml = `
                <section class="match-hero">
                    <div class="match-hero__bar">
                        <span class="pg-badge pg-badge--solid">Próximo partido</span>
                        <span class="t-meta">Jornada ${jornadaOf(nextMatch, idx)} · ${info.formattedDate}${timeOf(nextMatch.date) ? ' · ' + timeOf(nextMatch.date) : ''} · ${nextMatch.stadium || 'La Camocha'}</span>
                        ${isAdmin ? `<button type="button" class="pg-btn pg-btn--sm btn-edit-match-direct" data-match-id="${nextMatch.id}">${I('edit')} Editar</button>` : ''}
                    </div>
                    <div class="match-hero__board">
                        <div class="match-hero__team">
                            ${ClubLogo.render(72)}
                            <span class="match-hero__name">${club}</span>
                        </div>
                        <div class="match-hero__center">
                            ${info.isFuture ? `
                                <div class="match-hero__count t-num">
                                    <span>${String(info.days).padStart(2, '0')}<small>días</small></span>
                                    <span class="match-hero__colon">:</span>
                                    <span>${String(info.hoursLeft).padStart(2, '0')}<small>horas</small></span>
                                </div>` : `<div class="match-hero__vs">VS</div>`}
                        </div>
                        <div class="match-hero__team match-hero__team--away">
                            ${rival(nextMatch.opponent, 'xl')}
                            <span class="match-hero__name">${nextMatch.opponent}</span>
                        </div>
                    </div>
                    <p class="match-hero__tagline t-meta">${banner}</p>
                </section>
            `;
        }

        return `
            <div class="pg-view">
                ${LowerThird({
                    page: 'matches',
                    title: 'Temporada',
                    sub: `Liga F7 Gijón · 26/27 · ${played.length} jugados · ${record[0]}V ${record[1]}E ${record[2]}D`,
                    actions: isAdmin ? `<button type="button" class="pg-btn pg-btn--primary" id="btn-add-new-match">${I('plus')} Añadir partido</button>` : ''
                })}

                ${heroHtml}

                <div class="matches-view-grid">
                    <section>
                        <div class="pg-h">
                            <h2 class="pg-h__title">Calendario</h2>
                            <button type="button" class="pg-btn pg-btn--ghost pg-btn--xs" id="toggle-calendar-btn" aria-expanded="true">
                                <span id="calendar-toggle-icon">Ocultar</span>
                            </button>
                        </div>
                        <ol id="calendar-content-wrapper" class="match-list">${rowsHtml}</ol>
                    </section>

                    <section>
                        <div class="pg-h">
                            <h2 class="pg-h__title">Clasificación</h2>
                            <span class="pg-h__meta">Liga F7 Gijón</span>
                        </div>
                        <div id="standings-content-wrapper" class="pg-table-wrap">
                            <table class="pg-table standings-table">
                                <thead><tr>
                                    <th>Pos</th><th>Equipo</th><th class="is-num">PJ</th><th class="is-num">G</th>
                                    <th class="is-num">E</th><th class="is-num">P</th><th class="is-num">DG</th><th class="is-num">Pts</th>
                                </tr></thead>
                                <tbody id="standings-table-body">${standingsRows}</tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Evento para contraer/desplegar el calendario de partidos
        const calBtn = document.getElementById('toggle-calendar-btn');
        const calWrapper = document.getElementById('calendar-content-wrapper');
        const calIcon = document.getElementById('calendar-toggle-icon');

        if (calBtn && calWrapper) {
            calBtn.addEventListener('click', (e) => {
                if (e.target.closest('#btn-add-new-match')) return;
                const isHidden = calWrapper.hidden;
                calWrapper.hidden = !isHidden;
                calBtn.setAttribute('aria-expanded', String(isHidden));
                if (calIcon) calIcon.textContent = isHidden ? 'Ocultar' : 'Mostrar';
            });
        }

        // Evento clic en la tarjeta del partido para abrir vista emergente (modal)
        document.querySelectorAll('.match-toggle-card').forEach(card => {
            card.addEventListener('keydown', (e) => { if (e.key === 'Enter') card.click(); });
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-edit-match-direct') || e.target.closest('.modal-overlay')) return;
                const matchId = parseInt(card.getAttribute('data-match-id'));
                const match = teamData.matches.find(m => m.id === matchId);
                if (match) {
                    this.openMatchDetailsModal(match);
                }
            });
        });

        // Eventos directos de edición para administradores
        document.querySelectorAll('.btn-edit-match-direct').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const matchId = parseInt(btn.getAttribute('data-match-id'));
                const match = teamData.matches.find(m => m.id === matchId);
                if (match) {
                    this.openEditMatchModal(match);
                }
            });
        });

        // Añadir nuevo partido al calendario (Admin)
        const btnAdd = document.getElementById('btn-add-new-match');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                const nextJornada = teamData.matches.length + 1;
                const draftMatch = {
                    id: Date.now(),
                    competition: `Liga F7 Gijón - Jornada ${nextJornada}`,
                    opponent: 'Feleches-Barciastur-Pesa',
                    date: '2026-09-05T18:00',
                    stadium: 'La Camocha',
                    type: 'future'
                };
                this.openEditMatchModal(draftMatch, true);
            });
        }
    },

    // Vista Emergente (Modal Popup) con los Detalles del Partido
    openMatchDetailsModal(match) {
        const getTeamRankStr = (teamName) => {
            const found = teamData.standings.find(s => s.name === teamName);
            return found ? `${found.rank}º` : '-';
        };

        const ourRank = getTeamRankStr(teamData.clubName);
        const oppRank = getTeamRankStr(match.opponent);
        const { formattedDate, countdownStr } = formatMatchDateAndCountdown(match.date);
        const stadiumName = match.stadium || "Campo Municipal La Camocha (Gijón)";
        const isAdmin = AuthService.isAdmin();

        let jornadaTitle = 'Jornada';
        if (match.competition && match.competition.includes('Jornada')) {
            jornadaTitle = match.competition.split('-').pop().trim();
        } else if (match.jornada) {
            jornadaTitle = `Jornada ${match.jornada}`;
        }

        const existingModal = document.getElementById('match-details-modal-overlay');
        if (existingModal) existingModal.remove();

        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-overlay active';
        modalWrapper.id = 'match-details-modal-overlay';
        const hasRes = match.ourScore !== undefined && match.ourScore !== null && match.opponentScore !== undefined && match.opponentScore !== null;
        const res = !hasRes ? '' : match.ourScore > match.opponentScore ? 'win' : match.ourScore < match.opponentScore ? 'loss' : 'draw';
        const scorers = (match.scorers || []).map(sc => {
            const p = teamData.players.find(pl => pl.id === sc.playerId);
            return p ? `${p.name}${sc.goals > 1 ? ' ×' + sc.goals : ''}` : null;
        }).filter(Boolean);

        modalWrapper.innerHTML = `
            <div class="pg-modal match-modal">
                ${ModalHead({ kicker: `${jornadaTitle} · ${formattedDate}`, title: res ? { win: 'Victoria', loss: 'Derrota', draw: 'Empate' }[res] : (countdownStr && countdownStr !== 'Finalizado' ? `Faltan ${countdownStr}` : 'Partido'), closeId: 'close-match-details-modal' })}
                <div class="match-modal__board ${res ? 'match-' + res : ''}">
                    <div class="match-modal__team">
                        ${ClubLogo.render(48)}
                        <span class="match-modal__name">${teamData.clubName}</span>
                        <span class="t-meta">${ourRank} en tabla</span>
                    </div>
                    <div class="match-modal__score t-num">${hasRes ? `${match.ourScore}<span>–</span>${match.opponentScore}` : '<span class="match-row__vs">VS</span>'}</div>
                    <div class="match-modal__team">
                        ${Crest(getRivalCrest(match.opponent), match.opponent, 'lg')}
                        <span class="match-modal__name">${match.opponent}</span>
                        <span class="t-meta">${oppRank} en tabla</span>
                    </div>
                </div>
                <div class="pg-modal__body match-modal__body">
                    ${scorers.length ? `
                        <div class="match-modal__block">
                            <div class="pg-label">Goleadores</div>
                            <p>${scorers.join(' · ')}</p>
                        </div>` : ''}
                    <div class="match-modal__block">
                        <div class="pg-label">Comentario del presidente</div>
                        <blockquote>“${match.presidentComment || 'Confiamos plenamente en el trabajo del equipo para seguir luchando por cada punto.'}”</blockquote>
                    </div>
                </div>
                <div class="pg-modal__foot match-modal__foot">
                    <span class="t-meta">${I('pin')} ${stadiumName}</span>
                    ${isAdmin ? `<button type="button" class="pg-btn pg-btn--sm" id="btn-edit-from-modal">${I('edit')} Editar partido</button>` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(modalWrapper);

        const closeModal = () => modalWrapper.remove();
        modalWrapper.querySelector('#close-match-details-modal').onclick = closeModal;
        modalWrapper.onclick = (e) => { if (e.target === modalWrapper) closeModal(); };

        if (isAdmin) {
            const btnEdit = modalWrapper.querySelector('#btn-edit-from-modal');
            if (btnEdit) {
                btnEdit.onclick = () => {
                    closeModal();
                    this.openEditMatchModal(match);
                };
            }
        }
    },

    openEditMatchModal(match, isNew = false) {
        if (!match) return;

        const allOpponents = Array.from(new Set([
            ...teamData.standings.filter(s => s.name !== teamData.clubName).map(s => s.name),
            ...teamData.matches.map(m => m.opponent)
        ])).sort();

        const opponentOptionsHtml = allOpponents.map(name => `
            <option value="${name}" ${name === match.opponent ? 'selected' : ''}>
                ${name}
            </option>
        `).join('');

        const stadiumOptionsHtml = (teamData.stadiums || [
            { id: 1, name: "La Camocha" },
            { id: 2, name: "La Braña" },
            { id: 3, name: "La Inmaculada" }
        ]).map(st => `
            <option value="${st.name}" ${(!match.stadium && st.name === 'La Camocha') || (match.stadium && match.stadium.includes(st.name)) ? 'selected' : ''}>
                ${st.name}
            </option>
        `).join('');

        const modalWrapper = document.createElement('div');
        modalWrapper.className = 'modal-overlay active';
        modalWrapper.id = 'edit-match-modal-overlay';
        modalWrapper.innerHTML = `
            <div class="pg-modal pg-modal--md">
                ${ModalHead({ kicker: 'Admin · Temporada', title: isNew ? 'Añadir partido' : 'Editar partido', closeId: 'close-edit-match-modal' })}
                <form id="edit-match-form" class="pg-form pg-modal__body">
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="edit-competition">Competición / jornada</label><input type="text" id="edit-competition" class="pg-input" value="${match.competition || 'Liga F7 Gijón'}" required></div>
                        <div class="pg-field"><label class="pg-label" for="edit-opponent">Rival</label><select id="edit-opponent" class="pg-input" required>${opponentOptionsHtml}</select></div>
                    </div>
                    <div class="pg-form__row">
                        <div class="pg-field"><label class="pg-label" for="edit-date">Fecha y hora</label><input type="datetime-local" id="edit-date" class="pg-input" value="${match.date && match.date.includes('T') ? match.date : '2026-09-05T18:00'}" required></div>
                        <div class="pg-field"><label class="pg-label" for="edit-stadium">Campo</label><select id="edit-stadium" class="pg-input" required>${stadiumOptionsHtml}</select></div>
                    </div>

                    <fieldset class="pg-fieldset">
                        <legend class="pg-label">Resultado (opcional) <span id="auto-outcome-badge"></span></legend>
                        <div class="pg-form__row">
                            <div class="pg-field"><label class="pg-label" for="edit-our-score">Giants</label><input type="number" id="edit-our-score" min="0" class="pg-input" value="${match.ourScore !== undefined && match.ourScore !== null ? match.ourScore : ''}"></div>
                            <div class="pg-field"><label class="pg-label" for="edit-opp-score">Rival</label><input type="number" id="edit-opp-score" min="0" class="pg-input" value="${match.opponentScore !== undefined && match.opponentScore !== null ? match.opponentScore : ''}"></div>
                        </div>
                    </fieldset>

                    <div class="pg-field">
                        <label class="pg-label" for="edit-president-comment">Comentario del presidente</label>
                        <textarea id="edit-president-comment" class="pg-input" rows="2" placeholder="La opinión del presidente sobre el encuentro…">${match.presidentComment || ''}</textarea>
                    </div>

                    <fieldset class="pg-fieldset">
                        <legend class="pg-label">Goles, asistencias y tarjetas</legend>
                        <div class="pg-table-wrap match-stats-editor">
                            <table class="pg-table pg-table--compact">
                                <thead><tr>
                                    <th>Jugador</th><th class="is-c">Jugó</th><th class="is-c">Gol</th><th class="is-c">Asis</th>
                                    <th class="is-c"><span class="card-ct card-ct--y"></span></th>
                                    <th class="is-c"><span class="card-ct card-ct--r"></span></th>
                                    <th class="is-c"><span class="card-ct card-ct--b"></span></th>
                                </tr></thead>
                                <tbody>
                                    ${teamData.players.map(p => `
                                        <tr>
                                            <td><span class="t-meta">#${p.number}</span> ${p.name}</td>
                                            <td class="is-c"><input type="checkbox" class="match-p-played" data-player-id="${p.id}"></td>
                                            <td class="is-c"><input type="number" min="0" value="0" class="match-p-goals pg-input pg-input--mini" data-player-id="${p.id}"></td>
                                            <td class="is-c"><input type="number" min="0" value="0" class="match-p-assists pg-input pg-input--mini" data-player-id="${p.id}"></td>
                                            <td class="is-c"><input type="number" min="0" max="2" value="0" class="match-p-yellows pg-input pg-input--mini" data-player-id="${p.id}"></td>
                                            <td class="is-c"><input type="number" min="0" max="1" value="0" class="match-p-reds pg-input pg-input--mini" data-player-id="${p.id}"></td>
                                            <td class="is-c"><input type="number" min="0" max="1" value="0" class="match-p-blues pg-input pg-input--mini" data-player-id="${p.id}"></td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>

                    <div class="pg-row pg-row--between">
                        ${!isNew ? `<button type="button" class="pg-btn pg-btn--danger" id="btn-delete-match">${I('trash')} Eliminar</button>` : '<span></span>'}
                        <div class="pg-row">
                            <button type="button" class="pg-btn" id="cancel-edit-match-btn">Cancelar</button>
                            <button type="submit" class="pg-btn pg-btn--primary">${I('check')} Guardar partido</button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modalWrapper);

        const closeModal = () => {
            if (document.body.contains(modalWrapper)) {
                document.body.removeChild(modalWrapper);
            }
        };

        const updateAutoOutcomeBadge = () => {
            const ourScore = parseInt(document.getElementById('edit-our-score').value) || 0;
            const oppScore = parseInt(document.getElementById('edit-opp-score').value) || 0;
            const badgeEl = document.getElementById('auto-outcome-badge');
            if (!badgeEl) return;

            const r = ourScore > oppScore ? ['win', 'Victoria'] : ourScore < oppScore ? ['loss', 'Derrota'] : ['draw', 'Empate'];
            badgeEl.innerHTML = `<span class="pg-badge pg-badge--${r[0]}">${r[1]}</span>`;
        };

        updateAutoOutcomeBadge();
        document.getElementById('edit-our-score').addEventListener('input', updateAutoOutcomeBadge);
        document.getElementById('edit-opp-score').addEventListener('input', updateAutoOutcomeBadge);

        modalWrapper.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', () => {
                const pid = input.getAttribute('data-player-id');
                if (pid && parseInt(input.value) > 0) {
                    const cb = modalWrapper.querySelector(`.match-p-played[data-player-id="${pid}"]`);
                    if (cb) cb.checked = true;
                }
            });
        });

        modalWrapper.querySelector('#close-edit-match-modal').addEventListener('click', closeModal);
        modalWrapper.querySelector('#cancel-edit-match-btn').addEventListener('click', closeModal);
        modalWrapper.addEventListener('click', (e) => {
            if (e.target === modalWrapper) closeModal();
        });

        const deleteBtn = modalWrapper.querySelector('#btn-delete-match');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas eliminar este partido del calendario?')) {
                    teamData.matches = teamData.matches.filter(m => m.id !== match.id);
                    saveMatchesToStorage();
                    closeModal();
                    state.notify();
                }
            });
        }

        modalWrapper.querySelector('#edit-match-form').addEventListener('submit', (ev) => {
            ev.preventDefault();

            const newCompetition = document.getElementById('edit-competition').value.trim();
            const newOpponent = document.getElementById('edit-opponent').value.trim();
            const newDate = document.getElementById('edit-date').value.trim();
            const newStadium = document.getElementById('edit-stadium').value.trim();
            const newPresidentComment = document.getElementById('edit-president-comment').value.trim();
            
            const ourScoreRaw = document.getElementById('edit-our-score').value.trim();
            const oppScoreRaw = document.getElementById('edit-opp-score').value.trim();
            const hasScore = ourScoreRaw !== '' || oppScoreRaw !== '';

            match.competition = newCompetition || match.competition;
            match.opponent = newOpponent || match.opponent;
            match.date = newDate || match.date;
            match.stadium = newStadium;
            match.presidentComment = newPresidentComment;

            if (hasScore) {
                match.type = 'past';
                const ourScore = parseInt(ourScoreRaw) || 0;
                const oppScore = parseInt(oppScoreRaw) || 0;
                match.ourScore = ourScore;
                match.opponentScore = oppScore;
                match.goalsGiants = ourScore;
                match.goalsOpponent = oppScore;
                if (ourScore > oppScore) {
                    match.outcome = 'win';
                    match.isWin = true;
                } else if (ourScore < oppScore) {
                    match.outcome = 'loss';
                    match.isWin = false;
                } else {
                    match.outcome = 'draw';
                    match.isWin = false;
                }
            } else {
                match.ourScore = undefined;
                match.opponentScore = undefined;
                match.goalsGiants = undefined;
                match.goalsOpponent = undefined;
                match.outcome = undefined;
                match.isWin = false;
            }

            const newScorers = [];
            const newAssists = [];

            teamData.players.forEach(p => {
                const playedCb = modalWrapper.querySelector(`.match-p-played[data-player-id="${p.id}"]`);
                const goalsIn = modalWrapper.querySelector(`.match-p-goals[data-player-id="${p.id}"]`);
                const assistsIn = modalWrapper.querySelector(`.match-p-assists[data-player-id="${p.id}"]`);
                const yellowsIn = modalWrapper.querySelector(`.match-p-yellows[data-player-id="${p.id}"]`);
                const redsIn = modalWrapper.querySelector(`.match-p-reds[data-player-id="${p.id}"]`);
                const bluesIn = modalWrapper.querySelector(`.match-p-blues[data-player-id="${p.id}"]`);

                const isPlayed = playedCb ? playedCb.checked : false;
                const goalsVal = goalsIn ? parseInt(goalsIn.value) || 0 : 0;
                const assistsVal = assistsIn ? parseInt(assistsIn.value) || 0 : 0;
                const yellowsVal = yellowsIn ? parseInt(yellowsIn.value) || 0 : 0;
                const redsVal = redsIn ? parseInt(redsIn.value) || 0 : 0;
                const bluesVal = bluesIn ? parseInt(bluesIn.value) || 0 : 0;

                if (goalsVal > 0) newScorers.push({ playerId: p.id, goals: goalsVal });
                if (assistsVal > 0) newAssists.push({ playerId: p.id, assists: assistsVal });

                if (isPlayed || goalsVal > 0 || assistsVal > 0 || yellowsVal > 0 || redsVal > 0 || bluesVal > 0) {
                    p.stats = p.stats || { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 };
                    p.stats.matches = (p.stats.matches || 0) + 1;
                    p.stats.goals = (p.stats.goals || 0) + goalsVal;
                    p.stats.assists = (p.stats.assists || 0) + assistsVal;
                    p.stats.yellowCards = (p.stats.yellowCards || 0) + yellowsVal;
                    p.stats.redCards = (p.stats.redCards || 0) + redsVal;
                    p.stats.blueCards = (p.stats.blueCards || 0) + bluesVal;

                    if (match.outcome === 'win') p.stats.wins = (p.stats.wins || 0) + 1;
                    else if (match.outcome === 'draw') p.stats.draws = (p.stats.draws || 0) + 1;
                    else if (match.outcome === 'loss') p.stats.losses = (p.stats.losses || 0) + 1;
                }
            });

            match.scorers = newScorers;
            match.assists = newAssists;

            if (isNew) {
                const existingIndex = teamData.matches.findIndex(m => m.id === match.id);
                if (existingIndex === -1) {
                    teamData.matches.push(match);
                }
            }

            saveMatchesToStorage();
            savePlayersToStorage();
            closeModal();
            state.notify();
        });
    }
};
