/* ==========================================
   POLÍGONO GIANTS F7 - BASE DE DATOS Y ESTADÍSTICAS
   ========================================== */

export const teamData = {
    clubName: "Polígono Giants",
    clubNickname: "Los Rosinegros",
    
    // Lista de Jugadores Oficiales (18 Jugadores - Stats tras 10 jornadas)
    players: [
        {
            id: 1,
            name: "Miguel",
            number: 13,
            position: "Portero",
            category: "porteros",
            emoji: "🧤",
            stats: { matches: 9, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 7, draws: 1, losses: 1 },
            info: { age: 24 }
        },
        {
            id: 2,
            name: "Javier Chimeno",
            number: 12,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 8, goals: 1, assists: 1, yellowCards: 2, redCards: 0, blueCards: 0, wins: 6, draws: 1, losses: 1 },
            info: { age: 25 }
        },
        {
            id: 3,
            name: "Joni",
            number: 89,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 6, goals: 0, assists: 1, yellowCards: 1, redCards: 0, blueCards: 0, wins: 4, draws: 1, losses: 1 },
            info: { age: 23 }
        },
        {
            id: 4,
            name: "Marcos Posligua",
            number: 67,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 5, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 1, wins: 4, draws: 0, losses: 1 },
            info: { age: 24 }
        },
        {
            id: 5,
            name: "Hugo Uría",
            number: 2,
            position: "Carrilero",
            category: "carrileros",
            emoji: "⚡",
            stats: { matches: 10, goals: 1, assists: 3, yellowCards: 1, redCards: 0, blueCards: 0, wins: 7, draws: 2, losses: 1 },
            info: { age: 23 }
        },
        {
            id: 6,
            name: "Enol",
            number: 4,
            position: "Carrilero",
            category: "carrileros",
            emoji: "🏃",
            stats: { matches: 9, goals: 2, assists: 4, yellowCards: 0, redCards: 0, blueCards: 0, wins: 6, draws: 2, losses: 1 },
            info: { age: 25 }
        },
        {
            id: 7,
            name: "Héctor Uría",
            number: 11,
            position: "Carrilero",
            category: "carrileros",
            emoji: "⚡",
            stats: { matches: 7, goals: 1, assists: 2, yellowCards: 0, redCards: 0, blueCards: 0, wins: 5, draws: 1, losses: 1 },
            info: { age: 23 }
        },
        {
            id: 8,
            name: "David Sánchez",
            number: 15,
            position: "Carrilero - Defensa",
            category: "carrileros",
            emoji: "🎯",
            stats: { matches: 6, goals: 0, assists: 1, yellowCards: 1, redCards: 0, blueCards: 0, wins: 4, draws: 1, losses: 1 },
            info: { age: 24 }
        },
        {
            id: 9,
            name: "Diego Riobello",
            number: 5,
            position: "Medio",
            category: "medios",
            emoji: "🧠",
            stats: { matches: 8, goals: 2, assists: 2, yellowCards: 1, redCards: 0, blueCards: 0, wins: 6, draws: 1, losses: 1 },
            info: { age: 26 }
        },
        {
            id: 10,
            name: "Cristian Muñiz",
            number: 6,
            position: "Medio - Delantero",
            category: "medios",
            emoji: "🔥",
            stats: { matches: 10, goals: 4, assists: 3, yellowCards: 1, redCards: 0, blueCards: 1, wins: 7, draws: 2, losses: 1 },
            info: { age: 24 }
        },
        {
            id: 11,
            name: "Dario Álvarez",
            number: 8,
            position: "Medio",
            category: "medios",
            emoji: "🪄",
            stats: { matches: 10, goals: 3, assists: 6, yellowCards: 0, redCards: 0, blueCards: 0, wins: 7, draws: 2, losses: 1 },
            info: { age: 25 }
        },
        {
            id: 12,
            name: "Rubén Montes",
            number: 10,
            position: "Medio - Delantero / Capitán",
            category: "medios",
            emoji: "🪄",
            stats: { matches: 10, goals: 8, assists: 9, yellowCards: 1, redCards: 0, blueCards: 1, wins: 7, draws: 2, losses: 1 },
            info: { age: 27 }
        },
        {
            id: 13,
            name: "Sergio",
            number: 17,
            position: "Medio",
            category: "medios",
            emoji: "⚽",
            stats: { matches: 6, goals: 1, assists: 1, yellowCards: 0, redCards: 0, blueCards: 0, wins: 4, draws: 1, losses: 1 },
            info: { age: 22 }
        },
        {
            id: 14,
            name: "Juan Diego",
            number: 21,
            position: "Medio",
            category: "medios",
            emoji: "🎯",
            stats: { matches: 5, goals: 0, assists: 2, yellowCards: 0, redCards: 0, blueCards: 0, wins: 4, draws: 0, losses: 1 },
            info: { age: 23 }
        },
        {
            id: 15,
            name: "Álvaro Chimeno",
            number: 23,
            position: "Medio",
            category: "medios",
            emoji: "⚽",
            stats: { matches: 6, goals: 1, assists: 1, yellowCards: 1, redCards: 0, blueCards: 0, wins: 4, draws: 1, losses: 1 },
            info: { age: 25 }
        },
        {
            id: 16,
            name: "Adrián",
            number: 7,
            position: "Delantero",
            category: "delanteros",
            emoji: "⚡",
            stats: { matches: 9, goals: 6, assists: 4, yellowCards: 1, redCards: 0, blueCards: 0, wins: 6, draws: 2, losses: 1 },
            info: { age: 24 }
        },
        {
            id: 17,
            name: "Rodrigo Cuesta",
            number: 9,
            position: "Delantero",
            category: "delanteros",
            emoji: "🔥",
            stats: { matches: 10, goals: 12, assists: 5, yellowCards: 1, redCards: 0, blueCards: 0, wins: 7, draws: 2, losses: 1 },
            info: { age: 26 }
        },
        {
            id: 18,
            name: "Thiago",
            number: 80,
            position: "Delantero",
            category: "delanteros",
            emoji: "🚀",
            stats: { matches: 6, goals: 3, assists: 1, yellowCards: 0, redCards: 0, blueCards: 0, wins: 4, draws: 1, losses: 1 },
            info: { age: 21 }
        }
    ],

    // Historial y Próximos Partidos (Inicio de Temporada en Octubre 2026)
    matches: [
        {
            id: 101,
            type: "next",
            competition: "Liga F7 Gijón - Jornada 1",
            opponent: "Gijón United",
            opponentEmoji: "🔴",
            date: "2026-10-01T20:30",
            stadium: "Campo Municipal La Camocha (Gijón)",
            isHome: true
        },
        {
            id: 102,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 2",
            opponent: "Desatascos Pelayo",
            opponentEmoji: "🛠️",
            date: "2026-10-08T20:30",
            isHome: true
        },
        {
            id: 103,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 3",
            opponent: "Aston Birra",
            opponentEmoji: "🍺",
            date: "2026-10-15T20:30",
            isHome: false
        },
        {
            id: 104,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 4",
            opponent: "Mesón el Refugio",
            opponentEmoji: "🍷",
            date: "2026-10-22T20:30",
            isHome: true
        },
        {
            id: 105,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 5",
            opponent: "Casa Toni",
            opponentEmoji: "🏠",
            date: "2026-10-29T20:30",
            isHome: false
        },
        {
            id: 106,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 6",
            opponent: "Samara FC",
            opponentEmoji: "⚡",
            date: "2026-11-05T20:30",
            isHome: true
        },
        {
            id: 107,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 7",
            opponent: "Puntolab",
            opponentEmoji: "🔬",
            date: "2026-11-12T20:30",
            isHome: false
        },
        {
            id: 108,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 8",
            opponent: "Leyendas Retiradas",
            opponentEmoji: "👑",
            date: "2026-11-19T20:30",
            isHome: true
        },
        {
            id: 109,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 9",
            opponent: "El Equipo A",
            opponentEmoji: "🚐",
            date: "2026-11-26T20:30",
            isHome: false
        },
        {
            id: 110,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 10",
            opponent: "Monos del Norte",
            opponentEmoji: "🐒",
            date: "2026-12-03T20:30",
            isHome: true
        },
        {
            id: 111,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 11",
            opponent: "Monsters United",
            opponentEmoji: "👾",
            date: "2026-12-10T20:30",
            isHome: false
        },
        {
            id: 112,
            type: "future",
            competition: "Liga F7 Gijón - Jornada 12",
            opponent: "Chatarrería Cebrián",
            opponentEmoji: "⚙️",
            date: "2026-12-17T20:30",
            isHome: true
        }
    ],

    // Clasificación de la Liga F7 Gijón (Tras 10 Jornadas)
    standings: [
        { rank: 1,  name: "Polígono Giants",     played: 10, wins: 7, draws: 2, losses: 1, goalsDiff: 21, points: 23, isCurrent: true },
        { rank: 2,  name: "Gijón United",         played: 10, wins: 7, draws: 0, losses: 3, goalsDiff: 14, points: 21, isCurrent: false },
        { rank: 3,  name: "Desatascos Pelayo",    played: 10, wins: 6, draws: 2, losses: 2, goalsDiff: 10, points: 20, isCurrent: false },
        { rank: 4,  name: "Aston Birra",          played: 10, wins: 5, draws: 3, losses: 2, goalsDiff: 7,  points: 18, isCurrent: false },
        { rank: 5,  name: "Mesón el Refugio",     played: 10, wins: 5, draws: 1, losses: 4, goalsDiff: 4,  points: 16, isCurrent: false },
        { rank: 6,  name: "Casa Toni",            played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 7,  name: "Samara FC",            played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 8,  name: "Puntolab",             played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 9,  name: "Leyendas Retiradas",   played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 10, name: "El Equipo A",          played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 11, name: "Monos del Norte",       played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 12, name: "Monsters United",      played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 13, name: "Chatarrería Cebrián",  played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 14, name: "La Camocha F7",        played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false }
    ],

    // Noticias
    news: [
        {
            id: 201,
            title: "Rodrigo Cuesta y Rubén Montes: La dupla que hace soñar a Polígono Giants",
            excerpt: "Nuestros referentes ofensivos #9 y #10 lideran el ataque del equipo con 38 goles en conjunto esta temporada.",
            emoji: "⚽",
            date: "Hace 2 horas"
        },
        {
            id: 202,
            title: "Javi Frey renueva como Patrocinador Principal de Polígono Giants F7",
            excerpt: "El club confirma el acuerdo de patrocinio oficial para lucir la marca Javi Frey en la camiseta rosinegra.",
            emoji: "⚡",
            date: "Ayer"
        },
        {
            id: 203,
            title: "Polígono Giants se clasifica a la gran Final Continental",
            excerpt: "Con paradas decisivas de Miguel #13 y goles de Adrián #7 y Cristian Muñiz #6, el equipo se mete en la final.",
            emoji: "🏆",
            date: "Hace 3 días"
        }
    ],

    // Patrocinadores Oficiales (Igualitarios)
    sponsors: [
        { id: 301, name: "Javi Frey", logo: "⚡", isJaviFrey: true, desc: "En Javi Frey somos una empresa de electricidad con base en Gijón y toda Asturias, comprometiéndonos con la máxima excelencia y seguridad." },
        { id: 302, name: "Mamba Shaved", logo: "💈", isMambaShaved: true, desc: "Mamba Shaved By Samu Barber • Barbería Oficial de Polígono Giants F7." },
        { id: 304, name: "Cafetería Bambi", logo: "🦌", isBambi: true, desc: "Cafetería Oficial y punto de encuentro de la afición de Polígono Giants F7." },
        { id: 305, name: "Saneamientos Hergo", logo: "🔧", desc: "Calefacción y Fontanería - Materiales, Reforma Integral de edificios e Interiorismo de viviendas y locales comerciales y Saneamiento" },
        { id: 308, name: "La Base Tattoo", logo: "🎨", isLaBase: true, desc: "Estudio de Tatuajes y Arte Corporal Oficial de Polígono Giants F7." },
        { id: 309, name: "TRM Sports", logo: "👕", isTrmSports: true, desc: "Equipaciones deportivas personalizadas para clubes que quieren diferenciarse." },
        { id: 310, name: "Soho Bar", logo: "🍸", isSohoBar: true, desc: "Bar musical desde 1992, especialidad pop español de los 80 y actual." },
        { id: 311, name: "Pastur", logo: "🏠", isPastur: true, desc: "Especialistas en Construcción, Reforma y Aislamiento de Tejados y Cubiertas Tradicionales." }
    ],

    // Multimedia (Fotos y Videos)
    media: [
        { id: 408, type: "photo", title: "Nuevo Fichaje Oficial: Presentación con la equipación rosinegra", category: "fichajes", image: "./src/assets/fichaje_1.jpg", thumbnail: "✨", date: "Reciente" },
        { id: 409, type: "photo", title: "Nuevo Fichaje Oficial: Incorporación de garantía para la temporada", category: "fichajes", image: "./src/assets/fichaje_2.jpg", thumbnail: "✨", date: "Reciente" },
        { id: 401, type: "photo", title: "Javier Chimeno #12 listo para saltar al terreno de juego", category: "partidos", image: "./src/assets/match-photo-1.jpg", thumbnail: "🏃", date: "Último Partido" },
        { id: 402, type: "photo", title: "Reunión táctica con el colegiado previo al choque", category: "partidos", image: "./src/assets/match-photo-2.jpg", thumbnail: "📋", date: "Último Partido" },
        { id: 403, type: "photo", title: "Rubén Montes #10 conectando un potente disparo de zurda", category: "partidos", image: "./src/assets/match-photo-3.jpg", thumbnail: "🔥", date: "Último Partido" },
        { id: 404, type: "photo", title: "Remate cruzado en zona de peligro del rival", category: "partidos", image: "./src/assets/match-photo-4.jpg", thumbnail: "⚽", date: "Último Partido" },
        { id: 405, type: "video", title: "Resumen: Victoria histórica vs Real Titanes (3-1)", category: "partidos", thumbnail: "🎮", duration: "03:45", views: "15.4k", videoUrl: "./src/assets/video_1.mp4" },
        { id: 406, type: "video", title: "Entrenamiento de intensidad: Preparando la Final", category: "entrenos", thumbnail: "🔥", duration: "02:10", views: "8.2k", videoUrl: "./src/assets/video_2.mp4" },
        { id: 407, type: "video", title: "Entrevista exclusiva con Rodrigo Cuesta #9", category: "entrevistas", thumbnail: "🎤", duration: "05:15", views: "12.3k", videoUrl: "./src/assets/video_3.mp4" }
    ]
};

// ----------------------------------------------------
// PERSISTENCIA PERMANENTE EN DISCO Y LOCALSTORAGE
// ----------------------------------------------------

const MATCHES_STORAGE_KEY = 'fc_hub_matches_v1';
const PLAYERS_STORAGE_KEY = 'fc_hub_players_v2';
const NEWS_STORAGE_KEY = 'fc_hub_news_v1';
const MEDIA_STORAGE_KEY = 'fc_hub_media_v1';
const SPONSORS_STORAGE_KEY = 'fc_hub_sponsors_v1';

// Cargar estado inicial desde localStorage
try {
    const savedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (savedMatches) teamData.matches = JSON.parse(savedMatches);

    const savedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (savedPlayers) {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed) && parsed.length > 0) teamData.players = parsed;
    }

    const savedNews = localStorage.getItem(NEWS_STORAGE_KEY);
    if (savedNews) teamData.news = JSON.parse(savedNews);

    const savedMedia = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (savedMedia) {
        const parsed = JSON.parse(savedMedia);
        if (Array.isArray(parsed) && parsed.length > 0) teamData.media = parsed;
    }

    const savedSponsors = localStorage.getItem(SPONSORS_STORAGE_KEY);
    if (savedSponsors) {
        const parsed = JSON.parse(savedSponsors);
        if (Array.isArray(parsed) && parsed.length > 0) teamData.sponsors = parsed;
    }
} catch (e) {
    console.error('[teamData] Error cargando inicial de localStorage:', e);
}

// Cargar versiones actualizadas desde archivos JSON en disco (prioridad disco)
fetch('./src/data/players.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.players = data;
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(teamData.players));
    }
}).catch(() => {});

fetch('./src/data/media.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.media = data;
        localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(teamData.media));
    }
}).catch(() => {});

fetch('./src/data/matches.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.matches = data;
        localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(teamData.matches));
    }
}).catch(() => {});

fetch('./src/data/news.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.news = data;
        localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(teamData.news));
    }
}).catch(() => {});

fetch('./src/data/sponsors.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.sponsors = data;
        localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(teamData.sponsors));
    }
}).catch(() => {});

// Funciones de guardado en localStorage + Disco permanente
export function saveMatchesToStorage() {
    try { localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(teamData.matches)); } catch (e) {}
    fetch('/api/save-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.matches)
    }).catch(() => {});
}

export function savePlayersToStorage() {
    try { localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(teamData.players)); } catch (e) {}
    fetch('/api/save-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.players)
    }).catch(() => {});
}

export function saveNewsToStorage() {
    try { localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(teamData.news)); } catch (e) {}
    fetch('/api/save-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.news)
    }).catch(() => {});
}

export function saveMediaToStorage() {
    try { localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(teamData.media)); } catch (e) {}
    fetch('/api/save-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.media)
    }).catch(() => {});
}

export function saveSponsorsToStorage() {
    try { localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(teamData.sponsors)); } catch (e) {}
    fetch('/api/save-sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.sponsors)
    }).catch(() => {});
}

