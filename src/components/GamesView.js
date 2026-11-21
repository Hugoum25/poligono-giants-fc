/* ==========================================
   FC HUB - VISTA DE JUEGOS OFICIALES (CARNET DE POLIGONERO & NUEVOS JUEGOS)
   ========================================== */

import { state } from '../state.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird } from './ui.js';

export const GamesView = {
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
        const total = this.questions.length;

        if (!this.quizState.isStarted) {
            return `
                <div class="quiz-intro">
                    <p class="quiz-intro__lead">Este es el examen oficial de poligonero. Para aprobar hay que sacar más de un 5, no como en la ESO.</p>
                    <button type="button" class="pg-btn pg-btn--primary" id="btn-start-quiz">${I('play')} Empezar · ${total} preguntas</button>
                </div>
            `;
        }

        if (this.quizState.isCompleted) {
            const passed = this.quizState.score > 5;
            return `
                <div class="quiz-result ${passed ? 'is-pass' : 'is-fail'}">
                    <span class="pg-badge ${passed ? 'pg-badge--solid' : 'pg-badge--loss'}">${passed ? 'Carnet aprobado' : 'Carnet no conseguido'}</span>
                    <div class="quiz-result__score t-num">${this.quizState.score}<span>/${total}</span></div>
                    <p class="quiz-result__msg">${passed
                        ? 'Enhorabuena: has aprobado con más de un 5 el examen oficial de poligonero.'
                        : 'Cinco o menos. Para aprobar necesitas más de un 5, ¡no como en la ESO!'}</p>
                    <button type="button" class="pg-btn" id="btn-restart-quiz">${I('refresh')} Reintentar</button>
                </div>
            `;
        }

        const qIdx = this.quizState.currentQuestion;
        const q = this.questions[qIdx];
        const LETTERS = ['A', 'B', 'C', 'D', 'E'];
        const optionsHtml = q.options.map((opt, idx) => {
            let cls = '';
            if (this.quizState.isAnswered) {
                if (idx === q.correct) cls = 'is-correct';
                else if (idx === this.quizState.selectedOption) cls = 'is-wrong';
                else cls = 'is-dim';
            }
            return `
                <button type="button" class="quiz-option quiz-option-btn ${cls}" data-opt-idx="${idx}" ${this.quizState.isAnswered ? 'disabled' : ''}>
                    <span class="quiz-option__letter">${LETTERS[idx]}</span>
                    <span class="quiz-option__text">${opt}</span>
                    ${cls === 'is-correct' ? I('check') : cls === 'is-wrong' ? I('close') : ''}
                </button>
            `;
        }).join('');

        return `
            <div class="quiz-q">
                <div class="quiz-q__meta">
                    <span class="t-meta t-signal">Pregunta ${String(qIdx + 1).padStart(2, '0')} / ${total}</span>
                    <span class="t-meta">Aciertos ${this.quizState.score}</span>
                </div>
                <div class="quiz-progress"><span style="width:${(qIdx / total) * 100}%"></span></div>
                <h3 class="quiz-q__text">${q.question.replace(/^\d+\.\s*/, '')}</h3>
                <div class="quiz-options">${optionsHtml}</div>
                ${this.quizState.isAnswered ? `
                    <div class="quiz-q__next">
                        <button type="button" class="pg-btn pg-btn--primary" id="btn-next-quiz-q">${qIdx + 1 === total ? 'Ver nota' : 'Siguiente'} ${I('arrowR')}</button>
                    </div>` : ''}
            </div>
        `;
    },

    render() {
        if (!AuthService.isAdmin()) {
            return `<div class="pg-view"><div class="pg-empty">${I('lock', 'pg-ico--lg')}<br>Acceso restringido a administradores</div></div>`;
        }

        return `
            <div class="pg-view">
                ${LowerThird({ page: 'games', title: 'Juegos', sub: 'Entrenamiento mental oficial · Demuestra cuánto sabes del club' })}

                <div class="games-grid">
                    <section class="game-card game-card--live">
                        <header class="game-card__head">
                            <div>
                                <span class="t-meta t-signal">Juego 01 · Examen oficial</span>
                                <h2 class="game-card__title">Carnet de Poligonero</h2>
                            </div>
                            <span class="pg-badge pg-badge--signal"><span class="pg-dot pg-dot--live"></span>En juego</span>
                        </header>
                        <div id="games-quiz-card-content-wrapper" class="game-card__body">
                            ${this.getQuizCardHtml()}
                        </div>
                    </section>

                    <section class="game-card game-card--soon">
                        <header class="game-card__head">
                            <div>
                                <span class="t-meta">Juego 02</span>
                                <h2 class="game-card__title">Próximamente</h2>
                            </div>
                            ${I('gamepad', 'pg-ico--lg')}
                        </header>
                        <div class="game-card__body">
                            <p class="t-mute">Estamos preparando el siguiente minijuego oficial de Polígono Giants. Atentos a la parrilla.</p>
                            <div class="game-card__noise" aria-hidden="true">Sin señal</div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    },

    updateQuizCardUI() {
        const wrapper = document.getElementById('games-quiz-card-content-wrapper');
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
        this.bindQuizEvents();
    }
};
