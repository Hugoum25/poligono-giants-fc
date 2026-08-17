/* ==========================================
   POLÍGONO GIANTS F7 - BASE DE DATOS Y ESTADÍSTICAS
   ========================================== */

import { GitHubSyncService } from '../services/githubSyncService.js';

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
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 24 }
        },
        {
            id: 2,
            name: "Javier Chimeno",
            number: 12,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 25 }
        },
        {
            id: 3,
            name: "Joni",
            number: 89,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 23 }
        },
        {
            id: 4,
            name: "Marcos Posligua",
            number: 67,
            position: "Defensa",
            category: "defensas",
            emoji: "🛡️",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 24 }
        },
        {
            id: 5,
            name: "Hugo Uría",
            number: 2,
            position: "Carrilero",
            category: "carrileros",
            emoji: "⚡",
            photo: "./src/assets/players/5-hugo-uria/photo.png",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 23 }
        },
        {
            id: 6,
            name: "Enol",
            number: 4,
            position: "Carrilero",
            category: "carrileros",
            emoji: "🏃",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 25 }
        },
        {
            id: 7,
            name: "Héctor Uría",
            number: 11,
            position: "Carrilero",
            category: "carrileros",
            emoji: "⚡",
            photo: "./src/assets/players/7-hector-uria/photo.png",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 23 }
        },
        {
            id: 8,
            name: "David Sánchez",
            number: 15,
            position: "Carrilero - Defensa",
            category: "carrileros",
            emoji: "🎯",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 24 }
        },
        {
            id: 9,
            name: "Diego Riobello",
            number: 5,
            position: "Medio",
            category: "medios",
            emoji: "🧠",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 26 }
        },
        {
            id: 10,
            name: "Cristian Muñoz",
            number: 6,
            position: "Medio - Delantero",
            category: "medios",
            emoji: "🔥",
            photo: "./src/assets/players/10-cristian-munoz/photo.png",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 24 }
        },
        {
            id: 11,
            name: "Dario Álvarez",
            number: 8,
            position: "Medio",
            category: "medios",
            emoji: "🪄",
            photo: "data:image/png;base64,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",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 25 }
        },
        {
            id: 12,
            name: "Rubén Montes",
            number: 10,
            position: "Medio - Delantero / Capitán",
            category: "medios",
            emoji: "🪄",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 27 }
        },
        {
            id: 13,
            name: "Sergio",
            number: 17,
            position: "Medio",
            category: "medios",
            emoji: "⚽",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 22 }
        },
        {
            id: 14,
            name: "Juan Diego",
            number: 21,
            position: "Medio",
            category: "medios",
            emoji: "🎯",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 23 }
        },
        {
            id: 15,
            name: "Álvaro Chimeno",
            number: 23,
            position: "Medio",
            category: "medios",
            emoji: "⚽",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 25 }
        },
        {
            id: 16,
            name: "Adrián",
            number: 7,
            position: "Delantero",
            category: "delanteros",
            emoji: "⚡",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 24 }
        },
        {
            id: 17,
            name: "Rodrigo Cuesta",
            number: 9,
            position: "Delantero",
            category: "delanteros",
            emoji: "🔥",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 26 }
        },
        {
            id: 18,
            name: "Thiago",
            number: 80,
            position: "Delantero",
            category: "delanteros",
            emoji: "🚀",
            stats: { matches: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, blueCards: 0, wins: 0, draws: 0, losses: 0 },
            info: { age: 21 }
        }
    ],

    // Historial y Próximos Partidos (13 Jornadas oficiales)
    matches: [
        {
                "id": 101,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 1",
                "opponent": "Gijón United",
                "opponentEmoji": "🔴",
                "date": "2026-09-05T18:00",
                "stadium": "La Camocha",
                "isHome": true
        },
        {
                "id": 102,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 2",
                "opponent": "Desatascos Pelayo",
                "opponentEmoji": "🛠️",
                "date": "2026-09-12T19:30",
                "stadium": "La Camocha",
                "isHome": true
        },
        {
                "id": 103,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 3",
                "opponent": "Aston Birra",
                "opponentEmoji": "🍺",
                "date": "2026-09-19T17:30",
                "stadium": "La Braña",
                "isHome": false
        },
        {
                "id": 104,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 4",
                "opponent": "Mesón el Refugio",
                "opponentEmoji": "🍖",
                "date": "2026-09-26T20:00",
                "stadium": "La Inmaculada",
                "isHome": true
        },
        {
                "id": 105,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 5",
                "opponent": "Casa Toni",
                "opponentEmoji": "🍕",
                "date": "2026-10-03T18:30",
                "stadium": "La Camocha",
                "isHome": false
        },
        {
                "id": 106,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 6",
                "opponent": "Samara FC",
                "opponentEmoji": "⚽",
                "date": "2026-10-10T19:00",
                "stadium": "La Braña",
                "isHome": true
        },
        {
                "id": 107,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 7",
                "opponent": "Puntolab",
                "opponentEmoji": "🔬",
                "date": "2026-10-17T18:00",
                "stadium": "La Camocha",
                "isHome": true
        },
        {
                "id": 108,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 8",
                "opponent": "Leyendas Retiradas",
                "opponentEmoji": "👑",
                "date": "2026-10-24T20:00",
                "stadium": "La Inmaculada",
                "isHome": true
        },
        {
                "id": 109,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 9",
                "opponent": "El Equipo A",
                "opponentEmoji": "🚐",
                "date": "2026-11-01T17:00",
                "stadium": "La Camocha",
                "isHome": false
        },
        {
                "id": 110,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 10",
                "opponent": "Monos del Norte",
                "opponentEmoji": "🐒",
                "date": "2026-11-08T19:00",
                "stadium": "La Braña",
                "isHome": true
        },
        {
                "id": 111,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 11",
                "opponent": "Monsters United",
                "opponentEmoji": "👾",
                "date": "2026-11-15T18:30",
                "stadium": "La Camocha",
                "isHome": false
        },
        {
                "id": 112,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 12",
                "opponent": "Chatarrería Cebrián",
                "opponentEmoji": "⚙️",
                "date": "2026-11-22T20:00",
                "stadium": "La Inmaculada",
                "isHome": true
        },
        {
                "id": 113,
                "type": "future",
                "competition": "Liga F7 Gijón - Jornada 13",
                "opponent": "Rayo La Arena",
                "opponentEmoji": "⚡",
                "date": "2026-11-29T17:30",
                "stadium": "La Camocha",
                "isHome": false
        }
],

    // Clasificación de la Liga F7 Gijón (Tras 10 Jornadas)
    standings: [
        { rank: 1,  name: "Polígono Giants",     played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: true },
        { rank: 2,  name: "Gijón United",         played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 3,  name: "Desatascos Pelayo",    played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0, points: 0, isCurrent: false },
        { rank: 4,  name: "Aston Birra",          played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0,  points: 0, isCurrent: false },
        { rank: 5,  name: "Mesón el Refugio",     played: 0, wins: 0, draws: 0, losses: 0, goalsDiff: 0,  points: 0, isCurrent: false },
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
            excerpt: "Con paradas decisivas de Miguel #13 y goles de Adrián #7 y Cristian Muñoz #6, el equipo se mete en la final.",
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

    // Terrenos de juego oficiales (Base de datos de Campos)
    stadiums: [
        { id: 1, name: "La Camocha" },
        { id: 2, name: "La Braña" },
        { id: 3, name: "La Inmaculada" }
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

const MATCHES_STORAGE_KEY = 'fc_hub_matches_v2';
const PLAYERS_STORAGE_KEY = 'fc_hub_players_dario_v30';
const NEWS_STORAGE_KEY = 'fc_hub_news_v1';
const MEDIA_STORAGE_KEY = 'fc_hub_media_v1';
const SPONSORS_STORAGE_KEY = 'fc_hub_sponsors_v1';

// Purgar automáticamente cachés antiguas de jugadores almacenadas en localStorage
try {
    Object.keys(localStorage).forEach(key => {
        if (key.includes('fc_hub_players') && key !== PLAYERS_STORAGE_KEY) {
            localStorage.removeItem(key);
        }
    });
} catch (e) {}

// Cargar estado inicial desde localStorage
try {
    const savedMatches = localStorage.getItem(MATCHES_STORAGE_KEY);
    if (savedMatches) teamData.matches = JSON.parse(savedMatches);

    const savedPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
    if (savedPlayers) {
        const parsed = JSON.parse(savedPlayers);
        if (Array.isArray(parsed) && parsed.length > 0) teamData.players = parsed;
    }
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

fetch('./src/data/stadiums.json?t=' + Date.now()).then(r => r.json()).then(data => {
    if (Array.isArray(data) && data.length > 0) {
        teamData.stadiums = data;
    }
}).catch(() => {});

// Funciones de guardado en localStorage + Disco permanente + Sincronización GitHub
export function saveMatchesToStorage() {
    try { localStorage.setItem(MATCHES_STORAGE_KEY, JSON.stringify(teamData.matches)); } catch (e) {}
    fetch('/api/save-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.matches)
    }).catch(() => {});
    GitHubSyncService.syncJsonFile('src/data/matches.json', teamData.matches, 'Actualización de partidos desde la web Admin');
}

export function savePlayersToStorage() {
    try { localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(teamData.players)); } catch (e) {}
    fetch('/api/save-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.players)
    }).catch(() => {});
    GitHubSyncService.syncJsonFile('src/data/players.json', teamData.players, 'Actualización de plantilla desde la web Admin');
}

export function saveNewsToStorage() {
    try { localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(teamData.news)); } catch (e) {}
    fetch('/api/save-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.news)
    }).catch(() => {});
    GitHubSyncService.syncJsonFile('src/data/news.json', teamData.news, 'Actualización de noticias desde la web Admin');
}

export function saveMediaToStorage() {
    try { localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(teamData.media)); } catch (e) {}
    fetch('/api/save-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.media)
    }).catch(() => {});
    GitHubSyncService.syncJsonFile('src/data/media.json', teamData.media, 'Actualización de media desde la web Admin');
}

export function saveSponsorsToStorage() {
    try { localStorage.setItem(SPONSORS_STORAGE_KEY, JSON.stringify(teamData.sponsors)); } catch (e) {}
    fetch('/api/save-sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamData.sponsors)
    }).catch(() => {});
    GitHubSyncService.syncJsonFile('src/data/sponsors.json', teamData.sponsors, 'Actualización de patrocinadores desde la web Admin');
}

