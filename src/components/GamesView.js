/* ==========================================
   FC HUB - VISTA DE JUEGOS OFICIALES (CARNET DE POLIGONERO & NUEVOS JUEGOS)
   ========================================== */

import { state } from '../state.js';
import { Icon3D } from './Icon3D.js';
import { AuthService } from '../services/authService.js';

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
        if (!AuthService.isAdmin()) {
            return `
                <div class="container" style="padding-top:60px; padding-bottom:80px; text-align:center;">
                    <div class="glass-card" style="max-width:520px; margin:0 auto; padding:40px 24px; border:1px solid var(--border-color-glow);">
                        <div style="font-size:3.5rem; margin-bottom:16px;">🔒</div>
                        <h2 style="font-family:'VT323', var(--font-mono); font-size:2.2rem; color:var(--club-primary); margin-bottom:12px;">ACCESO RESTRINGIDO A ADMINISTRADORES</h2>
                        <p style="color:var(--text-muted); font-size:1.05rem; line-height:1.5; margin-bottom:0;">
                            El apartado de juegos solo está disponible para usuarios con rol de administrador.
                        </p>
                    </div>
                </div>
            `;
        }

        return `
            <div class="container" style="padding-top:40px; padding-bottom:80px;">
                <h2 class="section-title" style="display:flex; align-items:center; gap:10px; font-family:'VT323', var(--font-mono); font-size:2.2rem;">
                    ${Icon3D.render('games', 'md', { speed: 0 })} JUEGOS OFICIALES DE POLÍGONO GIANTS
                </h2>
                <p style="color:var(--text-muted); margin-bottom:36px; max-width:650px; font-size:1.05rem; line-height:1.4;">
                    Bienvenido al área oficial de entrenamiento mental y juegos interactivos del club. Demuestra cuánto sabes sobre Polígono Giants FC o pon a prueba tus habilidades.
                </p>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap:24px; align-items:start;">
                    
                    <!-- JUEGO 1: CARNET DE POLIGONERO (QUIZ DE 10 PREGUNTAS) -->
                    <div class="glass-card" style="padding:26px; box-sizing:border-box;">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; border-bottom:2px solid var(--border-color-glow); padding-bottom:10px;">
                            <h2 style="font-size:1.5rem; margin:0; font-family:'VT323', var(--font-mono); color:var(--text-main); text-transform:uppercase;">
                                CARNET DE POLIGONERO
                            </h2>
                            <span style="font-size:0.82rem; font-family:var(--font-mono); color:var(--club-primary); font-weight:700;">
                                EXAMEN OFICIAL • 10 PREGUNTAS
                            </span>
                        </div>

                        <div id="games-quiz-card-content-wrapper">
                            ${this.getQuizCardHtml()}
                        </div>
                    </div>

                    <!-- JUEGO 2: PRÓXIMO JUEGO (PRÓXIMAMENTE) -->
                    <div class="glass-card" style="padding:32px 26px; box-sizing:border-box; text-align:center; opacity:0.85;">
                        <div style="font-size:3.5rem; margin-bottom:16px;">🕹️</div>
                        <h3 style="font-size:1.7rem; font-family:'VT323', var(--font-mono); color:var(--club-primary); margin-bottom:10px; text-transform:uppercase; letter-spacing:0.05em;">
                            PRÓXIMO MINIJUEGO
                        </h3>
                        <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.5; margin-bottom:24px;">
                            Estamos preparando el siguiente juego oficial de Polígono Giants FC. ¡Permanece atento para nuevos retos y clasificaciones!
                        </p>
                        <button class="btn btn-secondary" disabled style="padding:10px 24px; font-size:0.95rem; font-family:'VT323', var(--font-mono); text-transform:uppercase; cursor:not-allowed;">
                            🔒 PRÓXIMAMENTE DISPONIBLE
                        </button>
                    </div>

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
