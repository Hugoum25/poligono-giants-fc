/* ==========================================================
   ICONOS — SVG inline, trazo 1.5px, sustituyen a los emojis de UI
   ========================================================== */

const paths = {
    user:     '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    key:      '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2.5 2.5M14 9l2 2"/>',
    logout:   '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
    edit:     '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
    trash:    '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    plus:     '<path d="M12 5v14M5 12h14"/>',
    close:    '<path d="M6 6l12 12M18 6L6 18"/>',
    check:    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrowR:   '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL:   '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    chevronD: '<path d="M6 9l6 6 6-6"/>',
    chevronR: '<path d="M9 6l6 6-6 6"/>',
    play:     '<path d="M7 5l12 7-12 7V5z" fill="currentColor" stroke="none"/>',
    pause:    '<path d="M8 5v14M16 5v14"/>',
    power:    '<path d="M12 3v8M7.05 6.05a7 7 0 1 0 9.9 0"/>',
    menu:     '<path d="M4 7h16M4 12h16M4 17h10"/>',
    logs:     '<path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4"/>',
    users:    '<circle cx="9" cy="8" r="3"/><path d="M3 19c.9-3 3.1-4.5 6-4.5s5.1 1.5 6 4.5M16 5.5a3 3 0 0 1 0 5.5M18 14.8c1.4.7 2.4 2 2.9 4.2"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    upload:   '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    image:    '<rect x="3.5" y="4.5" width="17" height="15"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-9 8.5"/>',
    video:    '<rect x="3" y="6" width="13" height="12"/><path d="M16 10.5l5-3v9l-5-3"/>',
    calendar: '<rect x="4" y="5" width="16" height="15"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    pin:      '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    trophy:   '<path d="M8 4h8v5a4 4 0 0 1-8 0V4zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8.5 20h7M10 17h4v3h-4z"/>',
    shield:   '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z"/>',
    ball:     '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5l3.8 2.8-1.4 4.5H9.6l-1.4-4.5L12 7.5zM12 3.5v4M20 10l-4.2.3M16.9 19l-2.5-4.2M7.1 19l2.5-4.2M4 10l4.2.3"/>',
    glove:    '<path d="M7 21v-5.5L4.5 12c-.8-1.2.6-2.6 1.8-1.7L8 12V5.5a1.25 1.25 0 0 1 2.5 0V11V4a1.25 1.25 0 0 1 2.5 0v7V5a1.25 1.25 0 0 1 2.5 0v6.5V7.5a1.25 1.25 0 0 1 2.5 0V15c0 3-1.5 4.5-3 6"/>',
    star:     '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L12 3.5z"/>',
    gamepad:  '<path d="M6.5 8h11a4 4 0 0 1 3.9 4.9l-.9 4a2.4 2.4 0 0 1-4.2 1L14.5 16h-5l-1.8 1.9a2.4 2.4 0 0 1-4.2-1l-.9-4A4 4 0 0 1 6.5 8zM8 11v3M6.5 12.5h3M15.5 12h.01M17.5 13.5h.01"/>',
    shirt:    '<path d="M8.5 3.5L3 6.5l2 4.5 2-1V20.5h10V10l2 1 2-4.5-5.5-3c-.4 1.6-1.8 2.7-3.5 2.7S8.9 5.1 8.5 3.5z"/>',
    swap:     '<path d="M7 4L3 8l4 4M3 8h14M17 12l4 4-4 4M21 16H7"/>',
    refresh:  '<path d="M20 11a8 8 0 0 0-14.3-4.3L4 9M4 4v5h5M4 13a8 8 0 0 0 14.3 4.3L20 15M20 20v-5h-5"/>',
    github:   '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    eye:      '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    lock:     '<rect x="5" y="10.5" width="14" height="10"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
    whistle:  '<circle cx="9" cy="14" r="5.5"/><path d="M12.5 9.8L21 6v4l-6.2 1.8M7.5 14h.01"/>',
    card:     '<rect x="7" y="3.5" width="10" height="17" rx="1"/>',
    send:     '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z"/>',
    sound:    '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    mute:     '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM16 9.5l5 5M21 9.5l-5 5"/>',
    expand:   '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
};

export const Icons = {
    /**
     * @param {string} name  clave de `paths`
     * @param {string} cls   clases extra (p. ej. 'pg-ico--lg')
     */
    render(name, cls = '') {
        const d = paths[name] || paths.shield;
        return `<svg class="pg-ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${d}</svg>`;
    }
};

export const I = (name, cls) => Icons.render(name, cls);
