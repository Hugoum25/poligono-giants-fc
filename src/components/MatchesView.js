import { state } from '../state.js';
import { teamData, saveMatchesToStorage, savePlayersToStorage, getRivalCrest } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';

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
    const hours = String(matchDate.getHours()).padStart(2, '0');
    const minutes = String(matchDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${day} de ${monthName} • ${hours}:${minutes}h`;

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

        // Formateador de tipo de encuentro (Solo muestra el marcador numérico si el partido ha finalizado)
        const getMatchStatusHtml = (match) => {
            if (match.ourScore !== undefined && match.ourScore !== null && match.opponentScore !== undefined && match.opponentScore !== null) {
                return `<span class="match-score-badge">${match.ourScore} - ${match.opponentScore}</span>`;
            }
            return ``;
        };

        // Crear listado de partidos (Muestra solo el enfrentamiento directo; abre modal emergente al hacer clic)
        const matchesListHtml = teamData.matches.map(match => {
            const dateObj = formatMatchDateAndCountdown(match.date);
            return `
                <div class="glass-card match-toggle-card" data-match-id="${match.id}" style="padding:14px 16px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; cursor:pointer; box-shadow:none !important; border-color:var(--border-color) !important;">
                    <!-- Fecha y Competición -->
                    <div style="flex:1; min-width:180px;">
                        <div style="font-size:0.75rem; font-weight:800; color:var(--club-primary); letter-spacing:0.04em; text-transform:uppercase;">
                            ${match.competition || 'Liga F7 Gijón'}
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); font-weight:700; margin-top:2px;">
                            ${dateObj.formattedDate}
                        </div>
                    </div>

                    <!-- Local vs Rival -->
                    <div style="display:flex; align-items:center; gap:10px; flex:1; justify-content:center;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            ${ClubLogo.render(22)}
                            <span style="font-family:var(--font-heading); font-weight:800; font-size:0.95rem; color:var(--text-main);">${teamData.clubName}</span>
                        </div>

                        <!-- Resultado o Estado -->
                        <div style="display:flex; align-items:center; gap:10px;">
                            ${getMatchStatusHtml(match)}
                        </div>

                        <!-- Rival -->
                        <div style="display:flex; align-items:center; gap:10px; flex:1; justify-content:flex-end; text-align:right;">
                            <span style="font-family:var(--font-heading); font-weight:800; font-size:0.95rem; color:var(--text-main);">${match.opponent}</span>
                            ${getRivalCrest(match.opponent) ? `
                                <div style="width:28px; height:28px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                    <img src="${getRivalCrest(match.opponent)}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                </div>
                            ` : `
                                <div style="width:28px; height:28px; background:rgba(255,255,255,0.06); border:1px solid var(--border-color); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800;">
                                    ${match.opponentEmoji || '🛡️'}
                                </div>
                            `}
                        </div>
                    </div>

                    ${isAdmin ? `
                        <button class="btn btn-secondary btn-edit-match-direct" data-match-id="${match.id}" style="font-size:0.72rem; padding:4px 8px; font-weight:800; margin-left:8px;">
                            ✏️ Editar
                        </button>
                    ` : ''}
                </div>
            `;
        }).join('');

        // Crear tabla de posiciones con escudo entre posición y nombre del equipo
        const standingsRowsHtml = teamData.standings.map(row => {
            const isCurrentTeam = row.name === teamData.clubName;
            let rowStyle = '';

            if (isCurrentTeam) {
                rowStyle = 'color:var(--club-primary); font-weight:800; background:rgba(255,42,133,0.1);';
            }

            const crestUrl = getRivalCrest(row.name);
            let crestHtml = '';

            if (isCurrentTeam) {
                crestHtml = ClubLogo.render(22);
            } else if (crestUrl) {
                crestHtml = `<img src="${crestUrl}" style="width:22px; height:22px; object-fit:contain; border-radius:50%; flex-shrink:0;" />`;
            } else {
                crestHtml = `<div style="width:22px; height:22px; border-radius:50%; background:rgba(255,255,255,0.06); border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; font-size:0.65rem; font-weight:800; flex-shrink:0; color:var(--text-muted);">🛡️</div>`;
            }

            return `
                <tr style="${rowStyle}">
                    <td style="padding:7px; text-align:center;">
                        <strong>${row.rank}</strong>
                    </td>
                    <td style="padding:7px; text-align:left;">
                        <div style="display:flex; align-items:center; gap:8px;">
                            ${crestHtml}
                            <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${isCurrentTeam ? teamData.clubName : row.name}</span>
                        </div>
                    </td>
                    <td style="padding:7px; text-align:center;">${row.played}</td>
                    <td style="padding:7px; text-align:center; color:#00e676;">${row.wins}</td>
                    <td style="padding:7px; text-align:center; color:#ffb300;">${row.draws}</td>
                    <td style="padding:7px; text-align:center; color:#ff4444;">${row.losses}</td>
                    <td style="padding:7px; text-align:center; font-family:var(--font-mono);">${row.goalsDiff >= 0 ? '+' + row.goalsDiff : row.goalsDiff}</td>
                    <td style="padding:7px; text-align:center; font-family:var(--font-mono); font-weight:800; color:${isCurrentTeam ? 'var(--club-primary)' : 'var(--text-main)'};">${row.points}</td>
                </tr>
            `;
        }).join('');

        const nextMatch = teamData.matches.find(m => m.type === "next") || teamData.matches[0];
        const nextMatchInfo = formatMatchDateAndCountdown(nextMatch ? nextMatch.date : '');

        let popcornBanner = '';
        if (nextMatchInfo.isFuture) {
            const daysText = nextMatchInfo.days === 1 ? '1 día' : `${nextMatchInfo.days} días`;
            const hoursText = nextMatchInfo.hoursLeft === 1 ? '1 hora' : `${nextMatchInfo.hoursLeft} horas`;
            popcornBanner = `Preparen las palomitas porque quedan ${daysText} y ${hoursText} para este partido.`;
        } else {
            popcornBanner = `Preparen las palomitas porque este partido se disputará muy pronto.`;
        }

        return `
            <div class="container" style="padding-top:20px; padding-bottom:80px;">
                <!-- HERO CARD: PRÓXIMO PARTIDO -->
                ${nextMatch ? `
                    <div class="glass-card" style="padding:18px 20px; margin-bottom:24px; box-sizing:border-box; border:1.5px solid var(--club-primary); background:var(--bg-dark); border-radius:6px; box-shadow:none !important;">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div style="font-size:0.78rem; font-weight:800; color:var(--club-primary); letter-spacing:0.04em; text-transform:uppercase;">
                                    Próximo Partido
                                </div>
                                ${isAdmin ? `
                                    <button class="btn btn-secondary btn-edit-match-direct" data-match-id="${nextMatch.id}" style="font-size:0.72rem; padding:4px 10px; font-weight:800;">
                                        ✏️ Editar Próximo Partido
                                    </button>
                                ` : ''}
                            </div>
                            
                            <div style="display:flex; align-items:center; gap:16px; margin:10px 0;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    ${ClubLogo.render(32)}
                                    <span style="font-size:1.05rem; font-weight:800; color:#fff;">${teamData.clubName}</span>
                                </div>
                                <span style="font-family:var(--font-heading); font-weight:800; color:var(--club-primary); font-size:0.95rem;">VS</span>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    ${getRivalCrest(nextMatch.opponent) ? `<img src="${getRivalCrest(nextMatch.opponent)}" style="width:28px; height:28px; object-fit:contain; border-radius:50%;" />` : ''}
                                    <span style="font-size:1.05rem; font-weight:800; color:#fff;">${nextMatch.opponent}</span>
                                </div>
                            </div>

                            <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700; margin-bottom:8px;">
                                ${nextMatch.stadium || 'Campo Municipal La Camocha (Gijón)'} • ${nextMatchInfo.formattedDate}
                            </div>

                            <div style="font-size:0.88rem; font-weight:800; color:#ffffff; margin-top:6px; line-height:1.3;">
                                🍿 ${popcornBanner}
                            </div>
                        </div>
                    </div>
                ` : ''}

                <div class="matches-view-grid">
                    <!-- Columna Izquierda: Calendario (Desplegable y Contraíble) -->
                    <div>
                        <div id="toggle-calendar-btn" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none; margin-bottom:14px; padding:8px 12px; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:4px; transition:background 0.2s ease;">
                            <h3 style="font-size:1.1rem; font-family:'VT323', var(--font-mono); color:var(--text-main); text-transform:uppercase; letter-spacing:0.05em; margin:0;">
                                Calendario de Partidos
                            </h3>
                            <div style="display:flex; align-items:center; gap:10px;">
                                ${isAdmin ? `
                                    <button class="btn btn-primary" id="btn-add-new-match" style="font-size:0.75rem; padding:4px 10px; font-weight:800;">
                                        ➕ Añadir Partido
                                    </button>
                                ` : ''}
                                <span id="calendar-toggle-icon" style="font-size:0.8rem; color:var(--club-primary); font-weight:700;">▲ Ocultar</span>
                            </div>
                        </div>
                        <div id="calendar-content-wrapper" class="matches-list" style="display:block;">
                            ${matchesListHtml}
                        </div>
                    </div>

                    <!-- Columna Derecha: Clasificación (Siempre visible y fija) -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; padding:8px 12px; background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:4px;">
                            <h3 style="font-size:1.1rem; font-family:'VT323', var(--font-mono); color:var(--text-main); text-transform:uppercase; letter-spacing:0.05em; margin:0;">
                                Clasificación
                            </h3>
                        </div>
                        <div id="standings-content-wrapper" class="glass-card standings-table-wrapper" style="display:block; box-shadow:none !important; border-color:var(--border-color) !important;">
                            <table class="standings-table">
                                <thead>
                                    <tr>
                                        <th>Pos</th>
                                        <th style="text-align:left;">Equipo</th>
                                        <th>PJ</th>
                                        <th style="color:#00e676;">G</th>
                                        <th style="color:#ffb300;">E</th>
                                        <th style="color:#ff4444;">P</th>
                                        <th>DG</th>
                                        <th style="color:var(--club-primary);">Pts</th>
                                    </tr>
                                </thead>
                                <tbody id="standings-table-body">
                                    ${standingsRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                const isHidden = calWrapper.style.display === 'none';
                calWrapper.style.display = isHidden ? 'block' : 'none';
                if (calIcon) calIcon.textContent = isHidden ? '▲ Ocultar' : '▼ Mostrar';
            });
        }

        // Evento clic en la tarjeta del partido para abrir vista emergente (modal)
        document.querySelectorAll('.match-toggle-card').forEach(card => {
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
        modalWrapper.innerHTML = `
            <div class="glass-card" style="max-width:440px; width:100%; padding:20px; position:relative; animation:slideUp 0.2s ease; box-sizing:border-box; border:1.5px solid var(--club-primary); box-shadow:none !important; background:var(--bg-dark);">
                <button class="modal-close" id="close-match-details-modal" style="position:absolute; top:12px; right:14px; background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer; line-height:1;">✕</button>

                <div style="font-size:0.8rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; padding-right:30px;">
                    <span>${jornadaTitle}</span>
                    <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.75rem;">${formattedDate}</span>
                </div>

                <div style="border:1px solid var(--border-color); border-radius:4px; padding:12px 10px; margin-bottom:12px; display:flex; align-items:center; justify-content:space-between; text-align:center; background:rgba(255,255,255,0.02);">
                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                        ${ClubLogo.render(32)}
                        <span style="font-family:var(--font-heading); font-weight:800; font-size:0.85rem; color:#fff; line-height:1.1;">${teamData.clubName}</span>
                        <span style="font-size:0.68rem; color:var(--club-primary); font-family:var(--font-mono); font-weight:700;">${ourRank} en tabla</span>
                    </div>

                    <div style="padding:0 10px;">
                        ${(match.ourScore !== undefined && match.ourScore !== null && match.opponentScore !== undefined && match.opponentScore !== null) ? `
                            <div style="font-size:1.8rem; font-weight:900; font-family:var(--font-mono); color:#fff; line-height:1;">
                                ${match.ourScore} - ${match.opponentScore}
                            </div>
                        ` : `
                            <div style="font-size:1.2rem; font-weight:800; color:var(--club-primary); font-family:var(--font-heading);">VS</div>
                        `}
                    </div>

                    <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
                        <span style="font-family:var(--font-heading); font-weight:800; font-size:0.85rem; color:#fff; line-height:1.1;">${match.opponent}</span>
                        <span style="font-size:0.68rem; color:var(--text-muted); font-family:var(--font-mono); font-weight:700;">${oppRank} en tabla</span>
                    </div>
                </div>

                ${(match.scorers && match.scorers.length > 0) ? `
                    <div style="border:1px solid var(--border-color); padding:8px 10px; border-radius:4px; margin-bottom:10px; font-size:0.78rem;">
                        <span style="color:var(--club-primary); font-weight:800;">Goleadores: </span>
                        <span style="font-weight:700; color:#fff;">${
                            match.scorers.map(s => {
                                const p = teamData.players.find(pl => pl.id === s.playerId);
                                return p ? `${p.name} (${s.goals})` : null;
                            }).filter(Boolean).join(', ')
                        }</span>
                    </div>
                ` : ''}

                <div style="border:1px solid var(--border-color); border-radius:4px; padding:10px; margin-bottom:10px; background:rgba(255,255,255,0.01);">
                    <div style="font-size:0.72rem; font-weight:800; color:var(--club-primary); text-transform:uppercase; margin-bottom:4px;">
                        Comentario del Presidente
                    </div>
                    <div style="font-size:0.78rem; font-style:italic; color:#d0d0d0; line-height:1.35;">
                        "${match.presidentComment || 'Confiamos plenamente en el trabajo del equipo para seguir luchando por cada punto.'}"
                    </div>
                </div>

                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; border-top:1px solid var(--border-color); padding-top:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#fff; font-weight:800;">${stadiumName}</span>
                    ${isAdmin ? `
                        <button class="btn btn-secondary" id="btn-edit-from-modal" style="font-size:0.72rem; font-weight:700; padding:3px 8px;">
                            ✏️ Editar Partido
                        </button>
                    ` : ''}
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
            <div class="glass-card" style="max-width:520px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; box-sizing:border-box; border:1.5px solid var(--club-primary);">
                <button class="modal-close" id="close-edit-match-modal" style="position:absolute; top:14px; right:14px; background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">✕</button>
                
                <h3 style="font-size:1.3rem; margin-bottom:16px; font-family:var(--font-heading); color:#fff;">
                    ${isNew ? '➕ Añadir Partido al Calendario' : '✏️ Editar Partido'}
                </h3>

                <form id="edit-match-form">
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <div>
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Competición / Jornada</label>
                            <input type="text" id="edit-competition" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.competition || 'Liga F7 Gijón'}" required>
                        </div>

                        <div>
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Estado del Partido</label>
                            <select id="edit-match-type" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;">
                                <option value="next" ${match.type === 'next' ? 'selected' : ''}>⭐ Próximo Partido (Destacado)</option>
                                <option value="future" ${match.type === 'future' || !match.type ? 'selected' : ''}>📅 Programado / Por Jugar</option>
                                <option value="past" ${match.type === 'past' ? 'selected' : ''}>✅ Finalizado con Resultado</option>
                            </select>
                        </div>

                        <div>
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Rival</label>
                            <select id="edit-opponent" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;" required>
                                ${opponentOptionsHtml}
                            </select>
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Fecha y hora</label>
                                <input type="datetime-local" id="edit-date" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.date && match.date.includes('T') ? match.date : '2026-09-05T18:00'}" required>
                            </div>
                            <div>
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Campo / Estadio</label>
                                <select id="edit-stadium" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; cursor:pointer;" required>
                                    ${stadiumOptionsHtml}
                                </select>
                            </div>
                        </div>

                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:4px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                <span style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Resultado (Opcional)</span>
                                <div id="auto-outcome-badge" style="font-size:0.75rem;"></div>
                            </div>
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                <div>
                                    <label style="font-size:0.75rem; color:var(--club-primary); font-weight:700; display:block; margin-bottom:4px;">Giants</label>
                                    <input type="number" id="edit-our-score" min="0" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.ourScore !== undefined && match.ourScore !== null ? match.ourScore : ''}">
                                </div>
                                <div>
                                    <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Rival</label>
                                    <input type="number" id="edit-opp-score" min="0" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.opponentScore !== undefined && match.opponentScore !== null ? match.opponentScore : ''}">
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Comentario del Presidente</label>
                            <textarea id="edit-president-comment" class="form-input" rows="2" style="width:100%; padding:8px 10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box; font-family:var(--font-main); font-size:0.8rem;" placeholder="Escribe la opinión o comentario del presidente sobre el encuentro...">${match.presidentComment || ''}</textarea>
                        </div>

                        <!-- Goles, asistencias y tarjetas -->
                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:12px; border-radius:4px;">
                            <div style="font-size:0.82rem; font-weight:700; color:var(--text-main); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">
                                Goles, asistencias y tarjetas de los jugadores
                            </div>
                            <div style="max-height:200px; overflow-y:auto; padding-right:4px;">
                                <table style="width:100%; font-size:0.72rem; border-collapse:collapse;">
                                    <thead>
                                        <tr style="color:var(--text-muted); text-align:center; border-bottom:1px solid var(--border-color);">
                                            <th style="text-align:left; padding:4px;">Jugador</th>
                                            <th style="padding:4px;">Jugó</th>
                                            <th style="padding:4px;">Gol</th>
                                            <th style="padding:4px;">Asis</th>
                                            <th style="padding:4px; color:#ffb300;">🟨</th>
                                            <th style="padding:4px; color:#ff4444;">🟥</th>
                                            <th style="padding:4px; color:#00b0ff;">🟦</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${teamData.players.map(p => `
                                            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                                <td style="padding:4px 2px; text-align:left; font-weight:700;">
                                                    #${p.number} ${p.name}
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="checkbox" class="match-p-played" data-player-id="${p.id}">
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="number" min="0" value="0" class="match-p-goals form-input" data-player-id="${p.id}" style="width:36px; padding:2px 4px; text-align:center; background:var(--bg-dark); color:#fff; border:1px solid var(--border-color); border-radius:3px;">
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="number" min="0" value="0" class="match-p-assists form-input" data-player-id="${p.id}" style="width:36px; padding:2px 4px; text-align:center; background:var(--bg-dark); color:#fff; border:1px solid var(--border-color); border-radius:3px;">
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="number" min="0" max="2" value="0" class="match-p-yellows form-input" data-player-id="${p.id}" style="width:36px; padding:2px 4px; text-align:center; background:var(--bg-dark); color:#fff; border:1px solid var(--border-color); border-radius:3px;">
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="number" min="0" max="1" value="0" class="match-p-reds form-input" data-player-id="${p.id}" style="width:36px; padding:2px 4px; text-align:center; background:var(--bg-dark); color:#fff; border:1px solid var(--border-color); border-radius:3px;">
                                                </td>
                                                <td style="padding:4px 2px; text-align:center;">
                                                    <input type="number" min="0" max="1" value="0" class="match-p-blues form-input" data-player-id="${p.id}" style="width:36px; padding:2px 4px; text-align:center; background:var(--bg-dark); color:#fff; border:1px solid var(--border-color); border-radius:3px;">
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                            ${!isNew ? `
                                <button type="button" class="btn btn-secondary" id="btn-delete-match" style="padding:8px 14px; background:rgba(255,68,68,0.2); color:#ff4444; border:1px solid #ff4444; border-radius:4px; font-weight:800; cursor:pointer;">
                                    🗑️ Eliminar
                                </button>
                            ` : '<div></div>'}
                            
                            <div style="display:flex; gap:10px;">
                                <button type="button" class="btn btn-secondary" id="cancel-edit-match-btn" style="padding:10px 18px;">Cancelar</button>
                                <button type="submit" class="btn btn-primary" style="padding:10px 22px;">Guardar Partido</button>
                            </div>
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

            if (ourScore > oppScore) {
                badgeEl.innerHTML = '<span style="background:rgba(0,230,118,0.2); color:#00e676; padding:2px 8px; border-radius:3px; font-weight:800; border:1px solid #00e676;">Victoria</span>';
            } else if (ourScore < oppScore) {
                badgeEl.innerHTML = '<span style="background:rgba(255,68,68,0.2); color:#ff4444; padding:2px 8px; border-radius:3px; font-weight:800; border:1px solid #ff4444;">Derrota</span>';
            } else {
                badgeEl.innerHTML = '<span style="background:rgba(255,179,0,0.2); color:#ffb300; padding:2px 8px; border-radius:3px; font-weight:800; border:1px solid #ffb300;">Empate</span>';
            }
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
            const newType = document.getElementById('edit-match-type').value;
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

            if (newType === 'next') {
                teamData.matches.forEach(m => {
                    if (m.type === 'next') m.type = 'future';
                });
                match.type = 'next';
            } else {
                match.type = newType;
            }

            if (hasScore || newType === 'past') {
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
