/* ==========================================
   FC HUB - VISTA INICIO CON CARNET DE POLIGONERO (QUIZ DE 10 PREGUNTAS Y ACTUALIZACIONES LOCALES)
   ========================================== */

import { state } from '../state.js';
import { teamData } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { ClubLogo } from './ClubLogo.js';
import { AuthService } from '../services/authService.js';

export const HomeView = {
    timerInterval: null,
    currentNewsIndex: 0,

    // Estado del Quiz Carnet de Poligonero
    quizState: {
        isStarted: false,
        currentQuestion: 0,
        score: 0,
        selectedOption: null,
        isAnswered: false,
        isCompleted: false
    },

    questions: [
        {
            question: "1. ¿Qué dorsal luce el guardameta Miguel en su camiseta?",
            options: ["1", "12", "13", "10"],
            correct: 2
        },
        {
            question: "2. ¿En qué posición juega habitualmente Hugo Uría?",
            options: ["Portero", "Carrilero", "Delantero", "Medio"],
            correct: 1
        },
        {
            question: "3. ¿Cuál es el dorsal del ariete y delantero Rodrigo Cuesta?",
            options: ["7", "11", "10", "9"],
            correct: 3
        },
        {
            question: "4. ¿Qué función principal desempeña el capitán Rubén Montes en el terreno de juego?",
            options: ["Medio - Delantero", "Portero", "Defensa Central", "Carrilero Derecho"],
            correct: 0
        },
        {
            question: "5. ¿Qué número lleva en la espalda el carrilero Enol?",
            options: ["2", "6", "4", "8"],
            correct: 2
        },
        {
            question: "6. ¿En qué demarcación del campo juega Marcos Posligua?",
            options: ["Medio", "Delantero", "Portero", "Defensa"],
            correct: 3
        },
        {
            question: "7. ¿Qué dorsal viste el centrocampista organizador Dario Álvarez?",
            options: ["10", "8", "6", "15"],
            correct: 1
        },
        {
            question: "8. ¿Cuál es la posición de Adrián en el ataque de Polígono Giants?",
            options: ["Portero", "Defensa", "Delantero", "Carrilero"],
            correct: 2
        },
        {
            question: "9. ¿Qué número lleva el carrilero Héctor Uría en la banda?",
            options: ["11", "7", "9", "3"],
            correct: 0
        },
        {
            question: "10. ¿En qué posición se desenvuelve el jugador Javier Chimeno?",
            options: ["Delantero", "Portero", "Defensa", "Medio"],
            correct: 2
        }
    ],

    getQuizCardHtml() {
        if (!this.quizState.isStarted) {
            return `
                <div style="text-align:center; padding:24px 16px; animation:fadeIn 0.4s ease;">
                    <h3 style="font-size:1.8rem; font-family:'VT323', var(--font-mono); color:var(--club-primary); margin-bottom:12px; text-transform:uppercase; letter-spacing:0.05em;">
                        CARNET DE POLIGONERO
                    </h3>
                    <p style="font-size:1.05rem; font-family:var(--font-heading); color:var(--text-main); max-width:620px; margin:0 auto 24px; line-height:1.5; font-weight:600;">
                        Este es el examen oficial de poligonero, para aprobar tienes que sacar más de un 5, no como en la ESO.
                    </p>
                    <button class="btn btn-primary" id="btn-start-quiz" style="padding:12px 32px; font-size:1.15rem; font-family:'VT323', var(--font-mono); letter-spacing:0.08em; text-transform:uppercase; box-shadow:0 0 20px rgba(var(--club-primary-rgb),0.5);">
                        INICIAR QUIZ (10 PREGUNTAS)
                    </button>
                </div>
            `;
        }

        if (this.quizState.isCompleted) {
            const isPassed = this.quizState.score > 5;
            return `
                <div style="text-align:center; padding:24px 16px; animation:fadeIn 0.4s ease;">
                    <div class="glass-card" style="max-width:480px; margin:0 auto 20px; padding:20px; border:2px solid ${isPassed ? 'var(--club-primary)' : 'rgba(255,50,50,0.5)'}; border-radius:12px; background:rgba(255,255,255,0.03);">
                        <h3 style="font-size:1.7rem; font-family:'VT323', var(--font-mono); color:${isPassed ? 'var(--club-primary)' : '#ff4444'}; margin-bottom:8px; text-transform:uppercase;">
                            ${isPassed ? '¡CARNET DE POLIGONERO APROBADO!' : 'CARNET NO CONSEGUIDO'}
                        </h3>
                        <p style="font-size:1.15rem; font-family:var(--font-mono); color:var(--text-main); margin-bottom:12px;">
                            Resultado: <strong style="color:${isPassed ? 'var(--club-primary)' : '#ff4444'}; font-size:1.4rem;">${this.quizState.score}</strong> / 10 aciertos
                        </p>
                        <p style="font-size:0.88rem; color:var(--text-muted); margin:0; line-height:1.4;">
                            ${isPassed 
                                ? '¡Enhorabuena! Has aprobado con más de un 5 el examen oficial de poligonero.' 
                                : 'Has obtenido 5 o menos aciertos. Para aprobar necesitas más de un 5, ¡no como en la ESO!'}
                        </p>
                    </div>

                    <button class="btn btn-primary" id="btn-restart-quiz" style="padding:10px 24px; font-size:1rem; font-family:'VT323', var(--font-mono); letter-spacing:0.08em; text-transform:uppercase;">
                        REINTENTAR QUIZ
                    </button>
                </div>
            `;
        }

        const qIdx = this.quizState.currentQuestion;
        const qData = this.questions[qIdx];
        const totalQ = this.questions.length;

        const optionsHtml = qData.options.map((opt, idx) => {
            let btnStyle = "background:rgba(255,255,255,0.04); border:1px solid var(--border-color); color:var(--text-main);";
            let iconStr = "";

            if (this.quizState.isAnswered) {
                if (idx === qData.correct) {
                    btnStyle = "background:rgba(0, 230, 118, 0.2); border:2px solid #00e676; color:#00e676; font-weight:800;";
                    iconStr = "✔";
                } else if (idx === this.quizState.selectedOption) {
                    btnStyle = "background:rgba(255, 42, 133, 0.25); border:2px solid var(--club-primary); color:var(--club-primary); font-weight:800;";
                    iconStr = "✖";
                }
            }

            return `
                <button class="quiz-option-btn" data-opt-idx="${idx}" ${this.quizState.isAnswered ? 'disabled' : ''} style="width:100%; padding:12px 16px; text-align:left; border-radius:8px; font-size:0.92rem; font-family:var(--font-heading); cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; justify-content:space-between; ${btnStyle}">
                    <span>${opt}</span>
                    <span style="font-size:1rem; font-weight:800;">${iconStr}</span>
                </button>
            `;
        }).join('');

        return `
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                    <span style="font-family:'VT323', var(--font-mono); font-size:1.3rem; color:var(--club-primary); text-transform:uppercase;">
                        Pregunta ${qIdx + 1} de ${totalQ}
                    </span>
                    <span style="font-family:var(--font-mono); font-size:0.88rem; color:var(--text-muted); font-weight:700;">
                        Aciertos: ${this.quizState.score} / ${totalQ} (Mínimo > 5 para aprobar)
                    </span>
                </div>

                <h3 style="font-size:1.15rem; font-family:var(--font-heading); color:var(--text-main); margin-bottom:18px; line-height:1.35;">
                    ${qData.question}
                </h3>

                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
                    ${optionsHtml}
                </div>

                ${this.quizState.isAnswered ? `
                    <div style="display:flex; justify-content:flex-end;">
                        <button class="btn btn-primary" id="btn-next-quiz-q" style="padding:10px 22px; font-size:0.95rem; font-family:'VT323', var(--font-mono); text-transform:uppercase; letter-spacing:0.08em;">
                            ${qIdx + 1 === totalQ ? 'Ver Calificación del Carnet' : 'Siguiente Pregunta ➔'}
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    },

    render() {
        const nextMatch = teamData.matches.find(m => m.type === "next") || teamData.matches[0];
        const lastMatch = teamData.matches.find(m => m.type === "past") || teamData.matches[1];
        const isAdmin = AuthService.isAdmin();
        
        const channels = [
            { id: "news",       title: "Noticias",       emoji: "📰" },
            { id: "squad",      title: "Plantilla",      emoji: "🏃" },
            { id: "matches",    title: "Partidos",       emoji: "⚽" },
            { id: "sponsors",   title: "Patrocinadores", emoji: "🤝" },
            { id: "multimedia", title: "Media",          emoji: "📸" },
            ...(isAdmin ? [{ id: "games", title: "Juegos", emoji: "🎮" }] : [])
        ];

        const channelsHtml = channels.map(ch => `
            <div class="tv-channel-card" data-page="${ch.id}" style="padding:10px 4px; text-align:center; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; cursor:pointer; box-sizing:border-box; background:transparent; border:none; box-shadow:none;">
                <div class="tv-channel-icon-wrapper" style="width:100%; display:flex; justify-content:center; align-items:center; min-height:110px;">
                    ${Icon3D.render(ch.id, 'md')}
                </div>
                <h4 style="font-size:1.35rem; margin:0; color:var(--text-main); font-family:'VT323', var(--font-mono); text-transform:uppercase; letter-spacing:0.08em; font-weight:700;">${ch.title.toUpperCase()}</h4>
            </div>
        `).join('');

        return `
            <div style="padding:16px; width:100%; box-sizing:border-box;">
                
                <!-- PARRILLA DE CANALES DE INICIO RESPONSIVA (6 CANALES: NOTICIAS, PLANTILLA, PARTIDOS, PATROCINADORES, MEDIA, JUEGOS) -->
                <div class="home-channels-grid">
                    ${channelsHtml}
                </div>

            </div>
        `;
    },

    updateQuizCardUI() {
        const wrapper = document.getElementById('quiz-card-content-wrapper');
        if (wrapper) {
            wrapper.innerHTML = this.getQuizCardHtml();
            this.bindQuizEvents();
        }
    },

    bindQuizEvents() {
        const btnStartQuiz = document.getElementById('btn-start-quiz');
        if (btnStartQuiz) {
            btnStartQuiz.onclick = () => {
                this.quizState.isStarted = true;
                this.updateQuizCardUI();
            };
        }

        document.querySelectorAll('.quiz-option-btn').forEach(btn => {
            btn.onclick = () => {
                if (this.quizState.isAnswered) return;

                const optIdx = parseInt(btn.getAttribute('data-opt-idx'));
                const qData = this.questions[this.quizState.currentQuestion];

                this.quizState.selectedOption = optIdx;
                this.quizState.isAnswered = true;

                if (optIdx === qData.correct) {
                    this.quizState.score += 1;
                }

                this.updateQuizCardUI();
            };
        });

        const btnNextQuizQ = document.getElementById('btn-next-quiz-q');
        if (btnNextQuizQ) {
            btnNextQuizQ.onclick = () => {
                if (this.quizState.currentQuestion + 1 >= this.questions.length) {
                    this.quizState.isCompleted = true;
                } else {
                    this.quizState.currentQuestion += 1;
                    this.quizState.isAnswered = false;
                    this.quizState.selectedOption = null;
                }
                this.updateQuizCardUI();
            };
        }

        const btnRestartQuiz = document.getElementById('btn-restart-quiz');
        if (btnRestartQuiz) {
            btnRestartQuiz.onclick = () => {
                this.quizState = {
                    isStarted: false,
                    currentQuestion: 0,
                    score: 0,
                    selectedOption: null,
                    isAnswered: false,
                    isCompleted: false
                };
                this.updateQuizCardUI();
            };
        }
    },

    bindEvents() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const btnGotoMatches = document.getElementById('btn-goto-matches');
        if (btnGotoMatches) {
            btnGotoMatches.addEventListener('click', () => {
                state.update({ activePage: 'matches' });
            });
        }

        // Cambiador de noticias
        const btnPrevNews = document.getElementById('btn-prev-news');
        if (btnPrevNews) {
            btnPrevNews.addEventListener('click', () => {
                const total = teamData.news.length;
                this.currentNewsIndex = (this.currentNewsIndex - 1 + total) % total;
                state.notify();
            });
        }

        const btnNextNews = document.getElementById('btn-next-news');
        if (btnNextNews) {
            btnNextNews.addEventListener('click', () => {
                const total = teamData.news.length;
                this.currentNewsIndex = (this.currentNewsIndex + 1) % total;
                state.notify();
            });
        }

        document.querySelectorAll('.news-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.getAttribute('data-news-index'));
                if (!isNaN(idx)) {
                    this.currentNewsIndex = idx;
                    state.notify();
                }
            });
        });

        const newsContent = document.getElementById('home-news-content');
        const btnReadNews = document.getElementById('btn-read-current-news');
        const openNews = () => {
            const currentNews = teamData.news[this.currentNewsIndex];
            if (currentNews) {
                state.update({ activePage: 'news', activeNewsId: currentNews.id });
            }
        };

        if (newsContent) newsContent.addEventListener('click', openNews);
        if (btnReadNews) btnReadNews.addEventListener('click', openNews);

        document.querySelectorAll('.tv-channel-card').forEach(card => {
            card.addEventListener('click', () => {
                const targetPage = card.getAttribute('data-page');
                if (targetPage) state.update({ activePage: targetPage });
            });
        });

        // Vincular eventos del quiz localmente
        this.bindQuizEvents();

        const countdownEl = document.getElementById('countdown-timer');
        if (countdownEl) {
            const targetDateStr = countdownEl.getAttribute('data-date');
            const targetTime = new Date(targetDateStr).getTime();
            
            const daysVal = document.getElementById('cd-days');
            const hoursVal = document.getElementById('cd-hours');
            const minsVal = document.getElementById('cd-mins');
            const secsVal = document.getElementById('cd-secs');

            const updateTimer = () => {
                const now = new Date().getTime();
                const difference = targetTime - now;

                if (difference <= 0) {
                    if (this.timerInterval) clearInterval(this.timerInterval);
                    return;
                }

                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                if (daysVal) daysVal.textContent = String(days).padStart(2, '0');
                if (hoursVal) hoursVal.textContent = String(hours).padStart(2, '0');
                if (minsVal) minsVal.textContent = String(minutes).padStart(2, '0');
                if (secsVal) secsVal.textContent = String(seconds).padStart(2, '0');
            };

            updateTimer();
            this.timerInterval = setInterval(updateTimer, 1000);
        }
    }
};
