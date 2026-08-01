import { state } from '../state.js';
import { teamData, saveMatchesToStorage, savePlayersToStorage } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';

// Helper para formatear fecha en español y calcular tiempo restante desde SYSDATE (Date.now())
export function formatMatchDateAndCountdown(dateStr) {
    if (!dateStr) return { formattedDate: 'Por determinar', countdownStr: '' };

    let matchDate;
    if (dateStr.includes('-') || dateStr.includes('T')) {
        matchDate = new Date(dateStr);
    } else {
        return { formattedDate: dateStr, countdownStr: '' };
    }

    if (isNaN(matchDate.getTime())) {
        return { formattedDate: dateStr, countdownStr: '' };
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
    if (diffMs > 0) {
        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const days = Math.floor(totalMinutes / (60 * 24));
        const hoursLeft = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minsLeft = totalMinutes % 60;

        if (days > 0) {
            countdownStr = `Faltan ${days}d ${hoursLeft}h`;
        } else if (hoursLeft > 0) {
            countdownStr = `Faltan ${hoursLeft}h ${minsLeft}m`;
        } else {
            countdownStr = `Faltan ${minsLeft}m`;
        }
    } else {
        countdownStr = 'Finalizado';
    }

    return { formattedDate, countdownStr };
}

export const MatchesView = {
    render() {
        // Formateador de tipo de encuentro
        const getMatchStatusHtml = (match) => {
            if ((match.ourScore !== undefined && match.ourScore !== null && match.opponentScore !== undefined && match.opponentScore !== null) || match.type === "past") {
                const outcomeText = match.outcome === 'win' ? 'W' : match.outcome === 'loss' ? 'L' : 'D';
                return `
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="match-score-badge">${match.ourScore} - ${match.opponentScore}</span>
                        <span class="match-result-outcome outcome-${match.outcome}">${outcomeText}</span>
                    </div>
                `;
            } else if (match.type === "next") {
                return `
                    <span style="font-size:0.85rem; padding:4px 8px; border-radius:var(--radius-sm); background:rgba(var(--club-primary-rgb), 0.15); color:var(--club-primary); font-weight:600; text-transform:uppercase;">
                        Siguiente Partido
                    </span>
                `;
            } else {
                return ``;
            }
        };

        // Obtener posición en la tabla de un equipo
        const isAdmin = AuthService.isAdmin();
        const getTeamRankStr = (teamName) => {
            const found = teamData.standings.find(s => s.name === teamName);
            return found ? `${found.rank}º` : '-';
        };

        // Crear listado de partidos
        const matchesListHtml = teamData.matches.map(match => {
            const ourRank = getTeamRankStr(teamData.clubName);
            const oppRank = getTeamRankStr(match.opponent);
            
            const { formattedDate, countdownStr } = formatMatchDateAndCountdown(match.date);
            const stadiumName = match.stadium || "Campo Municipal La Camocha (Gijón)";

            let matchOutcomeClass = '';
            if (match.ourScore !== undefined && match.ourScore !== null && match.opponentScore !== undefined && match.opponentScore !== null) {
                const outcome = match.outcome || (match.ourScore > match.opponentScore ? 'win' : match.ourScore < match.opponentScore ? 'loss' : 'draw');
                matchOutcomeClass = `match-${outcome}`;
            }

            return `
                <div class="glass-card static-match-card ${matchOutcomeClass}" style="padding:8px 12px; border-radius:4px; box-sizing:border-box; display:flex; flex-direction:column; gap:6px; position:relative;">
                    ${isAdmin ? `<button class="btn-edit-match" data-id="${match.id}" data-opponent="${match.opponent}" title="Editar partido" style="position:absolute; top:4px; right:4px; padding:1px 4px; font-size:0.62rem; border-radius:3px; background:rgba(255,42,133,0.15); border:1px solid var(--club-primary); color:var(--club-primary); cursor:pointer; line-height:1; z-index:10;">✏️</button>` : ''}
                    
                    <!-- Día, Campo y Contador Sysdate -->
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:4px; font-size:0.75rem; padding-right:18px;">
                        <span style="font-family:var(--font-mono); font-weight:700; color:var(--club-primary);">
                            📅 ${formattedDate}
                        </span>
                        <span style="color:var(--text-muted); font-size:0.75rem; font-weight:600;">
                            📍 Campo: ${stadiumName}
                        </span>
                    </div>

                    <!-- Enfrentamiento y Posición Actual de cada Equipo -->
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        
                        <!-- Polígono Giants (Posición Actual) -->
                        <div style="display:flex; align-items:center; gap:8px; flex:1;">
                            ${ClubLogo.render(28)}
                            <div>
                                <div style="font-family:var(--font-heading); font-weight:800; font-size:0.95rem; color:var(--text-main);">
                                    ${teamData.clubName}
                                </div>
                                <div style="font-size:0.72rem; color:var(--club-primary); font-family:var(--font-mono); font-weight:700;">
                                    Posición: ${ourRank}
                                </div>
                            </div>
                        </div>

                        <!-- Resultado o Estado -->
                        <div style="text-align:center; padding:0 10px;">
                            ${getMatchStatusHtml(match)}
                        </div>

                        <!-- Rival (Posición Actual) -->
                        <div style="display:flex; align-items:center; gap:8px; flex:1; justify-content:flex-end; text-align:right;">
                            <div>
                                <div style="font-family:var(--font-heading); font-weight:800; font-size:0.95rem; color:var(--text-main);">
                                    ${match.opponent}
                                </div>
                                <div style="font-size:0.72rem; color:var(--text-muted); font-family:var(--font-mono); font-weight:700;">
                                    Posición: ${oppRank}
                                </div>
                            </div>
                            <div style="width:28px; height:28px; background:rgba(255,255,255,0.06); border:1px solid var(--border-color); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">
                                🛡️
                            </div>
                        </div>

                    </div>
                </div>
            `;
        }).join('');

        // Crear tabla de posiciones (Solo números y datos, sin íconos)
        const standingsRowsHtml = teamData.standings.map(row => {
            const isCurrentTeam = row.name === teamData.clubName;
            const isAscenso = row.rank <= 3;
            const isDescenso = row.rank >= 13;
            
            let rowStyle = '';

            if (isAscenso) {
                rowStyle = 'border-left: 3px solid #00e676; background: rgba(0, 230, 118, 0.05);';
            } else if (isDescenso) {
                rowStyle = 'border-left: 3px solid #ff4444; background: rgba(255, 68, 68, 0.05);';
            }

            if (isCurrentTeam) {
                rowStyle += ' color:var(--club-primary); font-weight:800; background:rgba(255,42,133,0.1) !important;';
            }

            return `
                <tr style="${rowStyle}">
                    <td style="padding:7px; text-align:center;">
                        <strong>${row.rank}</strong>
                    </td>
                    <td style="padding:7px; text-align:left;">
                        ${isCurrentTeam ? teamData.clubName : row.name}
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
        const nextMatchInfo = formatMatchDateAndCountdown(nextMatch.date);

        return `
            <div class="container" style="padding-top:40px; padding-bottom:80px;">
                <h2 class="section-title">
                    Partidos y Clasificación
                </h2>
                
                <!-- HERO CARD: PRÓXIMO PARTIDO -->
                <div class="glass-card" style="padding:20px 24px; margin-bottom:28px; box-sizing:border-box; border:1.5px solid var(--club-primary); background:linear-gradient(135deg, rgba(255,42,133,0.08) 0%, rgba(13,16,30,0.6) 100%); border-radius:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                        <div style="flex:1; min-width:260px;">
                            <span style="font-size:0.82rem; font-weight:800; color:var(--club-primary); letter-spacing:0.06em; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                                ⚽ Próximo Encuentro Oficial
                            </span>
                            
                            <div style="display:flex; align-items:center; gap:20px; margin:12px 0;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    ${ClubLogo.render(38)}
                                    <span style="font-size:1.1rem; font-weight:800; color:var(--text-main);">Giants</span>
                                </div>
                                <span style="font-family:var(--font-heading); font-weight:800; color:var(--club-primary); font-size:1rem;">VS</span>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="font-size:1.6rem;">${nextMatch.opponentEmoji || '🛡️'}</span>
                                    <span style="font-size:1.1rem; font-weight:800; color:var(--text-main);">${nextMatch.opponent}</span>
                                </div>
                            </div>

                            <div style="font-size:0.78rem; color:var(--text-muted); font-weight:700;">
                                📍 ${nextMatch.stadium || 'Campo Municipal La Camocha (Gijón)'} • 📅 ${nextMatchInfo.formattedDate}
                            </div>
                        </div>

                        <div style="border-left:1px solid var(--border-color); padding-left:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; min-width:180px;">
                            <span style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; font-weight:800; letter-spacing:0.05em; margin-bottom:6px;">Cuenta Atrás</span>
                            <div style="font-family:var(--font-mono); font-weight:800; font-size:1.5rem; color:var(--club-primary); text-shadow:0 0 10px rgba(var(--club-primary-rgb),0.4);">
                                ${nextMatchInfo.countdownStr || 'Por disputar'}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="matches-view-grid">
                    <!-- Columna Izquierda: Calendario -->
                    <div>
                        <h3 style="font-size:1.3rem; margin-bottom:16px; font-family:'VT323', var(--font-mono); color:var(--text-main); text-transform:uppercase; letter-spacing:0.05em;">
                            Calendario
                        </h3>
                        <div class="matches-list">
                            ${matchesListHtml}
                        </div>
                    </div>

                    <!-- Columna Derecha: Clasificación -->
                    <div>
                        <h3 style="font-size:1.3rem; margin-bottom:16px; font-family:'VT323', var(--font-mono); color:var(--text-main); text-transform:uppercase; letter-spacing:0.05em;">
                            Clasificación
                        </h3>
                        <div class="glass-card standings-table-wrapper">
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
                            
                            <div style="margin-top:16px; padding-top:12px; border-top:1px solid var(--border-color); font-size:0.8rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="display:inline-block; width:12px; height:12px; background:#00e676; border-radius:2px;"></span>
                                    <span><strong>Posiciones 1º a 3º:</strong> Zona de Ascenso Directo ⬆️</span>
                                </div>
                                <div style="display:flex; align-items:center; gap:8px;">
                                    <span style="display:inline-block; width:12px; height:12px; background:#ff4444; border-radius:2px;"></span>
                                    <span><strong>Posiciones 13º y 14º:</strong> Zona de Descenso ⬇️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents() {
        // Evento editar partido (solo admin)
        document.querySelectorAll('.btn-edit-match').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const matchId = btn.getAttribute('data-id');
                const match = teamData.matches.find(m => m.id == matchId);
                if (!match) return;

                const modalWrapper = document.createElement('div');
                modalWrapper.className = 'modal-overlay active';
                modalWrapper.id = 'edit-match-modal-overlay';
                modalWrapper.innerHTML = `
                    <div class="glass-card" style="max-width:500px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; box-sizing:border-box;">
                        <button class="modal-close" id="close-edit-match-modal" style="position:absolute; top:14px; right:14px; background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">✕</button>
                        
                        <h3 style="font-size:1.3rem; margin-bottom:6px; display:flex; align-items:center; gap:8px; font-family:var(--font-heading);">
                            ✏️ Editar Partido
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                            Modifica los datos del encuentro contra <strong>${match.opponent}</strong>
                        </p>

                        <form id="edit-match-form">
                            <div style="display:flex; flex-direction:column; gap:14px;">
                                <div>
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Equipo Rival</label>
                                    <input type="text" id="edit-opponent" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.opponent}" required>
                                </div>

                                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                    <div>
                                        <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Fecha y Hora (Calendario)</label>
                                        <input type="datetime-local" id="edit-date" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.date && match.date.includes('T') ? match.date : '2026-05-28T20:30'}" required>
                                    </div>
                                    <div>
                                        <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Estado del Partido</label>
                                        <select id="edit-type" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;">
                                            <option value="next" ${match.type === 'next' ? 'selected' : ''}>🔥 Siguiente Partido</option>
                                            <option value="past" ${match.type === 'past' ? 'selected' : ''}>✅ Jugado / Finalizado</option>
                                            <option value="future" ${match.type === 'future' ? 'selected' : ''}>📅 Futuro / Programado</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Campo / Estadio</label>
                                    <input type="text" id="edit-stadium" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.stadium || 'Campo Municipal La Camocha (Gijón)'}">
                                </div>

                                <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:14px; border-radius:4px;">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                        <span style="font-size:0.85rem; font-weight:700; color:var(--text-main);">Resultado del Partido</span>
                                        <div id="auto-outcome-badge" style="font-size:0.75rem;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                                        <div>
                                            <label style="font-size:0.75rem; color:var(--club-primary); font-weight:700; display:block; margin-bottom:4px;">Polígono Giants</label>
                                            <input type="number" id="edit-our-score" min="0" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.ourScore !== undefined && match.ourScore !== null ? match.ourScore : 0}">
                                        </div>
                                        <div>
                                            <label style="font-size:0.75rem; color:var(--text-muted); font-weight:700; display:block; margin-bottom:4px;">Rival</label>
                                            <input type="number" id="edit-opp-score" min="0" class="form-input" style="width:100%; padding:8px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; box-sizing:border-box;" value="${match.opponentScore !== undefined && match.opponentScore !== null ? match.opponentScore : 0}">
                                        </div>
                                    </div>
                                </div>

                                <!-- Acta del Partido: Estadísticas por Jugador -->
                                <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); padding:12px; border-radius:4px;">
                                    <div style="font-size:0.82rem; font-weight:700; color:var(--text-main); margin-bottom:8px; border-bottom:1px solid var(--border-color); padding-bottom:4px;">
                                        Acta de Jugadores (Goles, Asistencias y Tarjetas)
                                    </div>
                                    <div style="max-height:220px; overflow-y:auto; padding-right:4px;">
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

                                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:8px;">
                                    <button type="button" class="btn btn-secondary" id="cancel-edit-match-btn" style="padding:10px 18px;">Cancelar</button>
                                    <button type="submit" class="btn btn-primary" style="padding:10px 22px;">Guardar Partido</button>
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

                // Inicializar indicativo en tiempo real
                updateAutoOutcomeBadge();

                document.getElementById('edit-our-score').addEventListener('input', updateAutoOutcomeBadge);
                document.getElementById('edit-opp-score').addEventListener('input', updateAutoOutcomeBadge);

                // Auto-marcar checkbox 'Jugó' si se ingresan goles, asistencias o tarjetas
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

                modalWrapper.querySelector('#edit-match-form').addEventListener('submit', (ev) => {
                    ev.preventDefault();

                    const newOpponent = document.getElementById('edit-opponent').value.trim();
                    const newDate = document.getElementById('edit-date').value.trim();
                    const newType = document.getElementById('edit-type').value;
                    const newStadium = document.getElementById('edit-stadium').value.trim();
                    const ourScore = parseInt(document.getElementById('edit-our-score').value) || 0;
                    const oppScore = parseInt(document.getElementById('edit-opp-score').value) || 0;

                    match.opponent = newOpponent || match.opponent;
                    match.date = newDate || match.date;
                    match.type = newType;
                    match.stadium = newStadium;

                    // Detección automática del resultado según los goles
                    match.ourScore = ourScore;
                    match.opponentScore = oppScore;
                    if (ourScore > oppScore) {
                        match.outcome = 'win';
                    } else if (ourScore < oppScore) {
                        match.outcome = 'loss';
                    } else {
                        match.outcome = 'draw';
                    }

                    // Acumular estadísticas individuales a los jugadores
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

                    // Actualizar clasificación de la liga
                    const ourTeamInStandings = teamData.standings.find(s => s.name === teamData.clubName);
                    if (ourTeamInStandings) {
                        ourTeamInStandings.played = (ourTeamInStandings.played || 0) + 1;
                        ourTeamInStandings.goalsDiff = (ourTeamInStandings.goalsDiff || 0) + (ourScore - oppScore);
                        if (match.outcome === 'win') {
                            ourTeamInStandings.wins = (ourTeamInStandings.wins || 0) + 1;
                            ourTeamInStandings.points = (ourTeamInStandings.points || 0) + 3;
                        } else if (match.outcome === 'draw') {
                            ourTeamInStandings.draws = (ourTeamInStandings.draws || 0) + 1;
                            ourTeamInStandings.points = (ourTeamInStandings.points || 0) + 1;
                        } else if (match.outcome === 'loss') {
                            ourTeamInStandings.losses = (ourTeamInStandings.losses || 0) + 1;
                        }
                    }

                    saveMatchesToStorage();
                    savePlayersToStorage();
                    closeModal();
                    state.notify();
                });
            });
        });
    }
};

