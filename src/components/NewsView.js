/* ==========================================
   FC HUB - VISTA DE NOTICIAS CON EDICIÓN Y ELIMINACIÓN ADMIN
   ========================================== */

import { state } from '../state.js';
import { teamData, saveNewsToStorage } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { AuthService } from '../services/authService.js';

export const NewsView = {
    showCreateModal: false,
    editingNewsId: null,

    render() {
        const canEdit = AuthService.hasPermission('edit_news');
        const todayStr = new Date().toISOString().split('T')[0];

        const newsCardsHtml = teamData.news.map(item => {
            const hasImage = item.image && item.image.trim().length > 0;

            return `
                <div class="glass-card static-news-card" style="cursor:default; display:flex; flex-direction:column; position:relative; overflow:hidden; border-radius:8px; min-height:250px; height:100%; justify-content:space-between; padding:0;">
                    <!-- FOTO DE FONDO CON UN POCO DE BLUR -->
                    <div style="position:absolute; inset:0; z-index:0; overflow:hidden; background:#0c0f1d;">
                        ${hasImage ? `
                            <img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; filter:blur(4px) brightness(0.65); transform:scale(1.08);" onerror="this.style.display='none';" />
                        ` : `
                            <div style="width:100%; height:100%; background:linear-gradient(135deg, rgba(var(--club-primary-rgb),0.25), #0c0f1d); filter:blur(4px);"></div>
                        `}
                        <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(6,7,12,0.95) 10%, rgba(6,7,12,0.4) 60%, rgba(6,7,12,0.7) 100%);"></div>
                    </div>

                    <!-- CONTENIDO DE LA TARJETA -->
                    <div style="position:relative; z-index:2; padding:20px; display:flex; flex-direction:column; justify-content:space-between; height:100%; box-sizing:border-box;">
                        <!-- CABECERA (FECHA Y BOTÓN EDITAR) -->
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                            <div style="font-size:0.75rem; color:var(--club-primary); font-weight:800; text-transform:uppercase; background:rgba(0,0,0,0.65); padding:4px 10px; border-radius:4px; border:1px solid rgba(var(--club-primary-rgb), 0.4); backdrop-filter:blur(4px);">
                                📅 ${item.date || 'Reciente'}
                            </div>
                            ${canEdit ? `
                                <button class="btn-edit-news" data-edit-id="${item.id}" title="Editar Noticia (Admin)" style="background:rgba(0,0,0,0.65); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:4px 8px; font-size:0.85rem; cursor:pointer;">
                                    ✏️
                                </button>
                            ` : ''}
                        </div>

                        <!-- TÍTULO DE LA NOTICIA -->
                        <div style="margin-top:auto; margin-bottom:16px;">
                            <h3 style="font-size:1.25rem; line-height:1.35; font-family:var(--font-heading); color:#ffffff; text-shadow:0 2px 8px rgba(0,0,0,0.85); margin:0;">
                                ${item.title}
                            </h3>
                        </div>

                        <!-- BOTÓN LEER NOTICIA -->
                        <button class="btn btn-secondary btn-read-news" data-news-id="${item.id}" style="width:100%; padding:10px; font-size:0.85rem; cursor:pointer; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fff; backdrop-filter:blur(6px); font-weight:700;">
                            📖 Leer Noticia
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Modal para leer noticia
        let newsModalHtml = '';
        if (state.activeNewsId !== null && state.activeNewsId !== undefined) {
            const article = teamData.news.find(n => n.id === state.activeNewsId);
            if (article) {
                const articleImg = article.image && article.image.trim().length > 0 ? `
                    <div style="width:100%; margin-bottom:20px; border-radius:6px; overflow:hidden; background:#101426;">
                        <img src="${article.image}" alt="${article.title}" style="width:100%; height:auto; display:block; object-fit:contain;" />
                    </div>
                ` : '';

                newsModalHtml = `
                    <div class="modal-overlay active" id="news-article-overlay">
                        <div class="glass-card" style="max-width:650px; width:100%; padding:32px; position:relative; animation:slideUp 0.3s ease; max-height:85vh; overflow-y:auto; margin:auto;">
                            <button class="modal-close" id="close-news-btn">✕</button>
                            
                            <!-- FECHA ARRIBA A LA IZQUIERDA EN MODAL -->
                            <div style="font-size:0.8rem; color:var(--club-primary); font-weight:700; text-transform:uppercase; margin-bottom:10px;">
                                ${article.date || 'Reciente'}
                            </div>

                            <h2 style="font-size:1.8rem; margin-bottom:18px; line-height:1.25; font-family:var(--font-heading);">${article.title}</h2>
                            
                            ${articleImg}
                            
                            <div style="font-size:1rem; line-height:1.7; color:var(--text-main); font-family:var(--font-body);">
                                ${article.excerpt.split('\n').map(p => `<p style="margin-bottom:14px;">${p}</p>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Modal para publicar noticia (Solo Admins)
        let createModalHtml = '';
        if (this.showCreateModal) {
            createModalHtml = `
                <div class="modal-overlay active" id="create-news-overlay">
                    <div class="glass-card" style="max-width:540px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; max-height:90vh; overflow-y:auto;">
                        <button class="modal-close" id="close-create-news-btn">✕</button>
                        <h3 style="font-size:1.4rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                            ${Icon3D.render('📝', 'sm')} Publicar Nueva Noticia
                        </h3>
                        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                            Añade el titular, la foto, la fecha y el contenido oficial de la noticia.
                        </p>

                        <form id="form-create-news">
                            <!-- 1. TÍTULO -->
                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Titular de la Noticia *</label>
                                <input type="text" id="new-news-title" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" placeholder="Ej: Nueva victoria aplastante de Polígono Giants" required>
                            </div>

                            <!-- 2. FECHA DE PUBLICACIÓN (AUTOMÁTICA Y BLOQUEADA) -->
                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Fecha de Publicación (Automática) 📅</label>
                                <input type="text" id="new-news-date" class="form-input" value="${(() => {
                                    const d = new Date();
                                    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                })()}" readonly style="width:100%; padding:10px; border-radius:4px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); color:var(--club-primary); font-weight:700; cursor:not-allowed;">
                            </div>

                            <!-- 3. FOTO DE LA NOTICIA -->
                            <div class="form-group" style="margin-bottom:12px; background:rgba(255,255,255,0.02); padding:12px; border:2px dashed var(--border-color-glow); border-radius:4px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--club-primary); display:block; margin-bottom:6px;">
                                    📁 Seleccionar Foto desde tu Dispositivo (.jpg, .png, .webp)
                                </label>
                                <input type="file" id="new-news-file" class="form-input" accept="image/*" style="width:100%; padding:6px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; cursor:pointer;">
                            </div>

                            <div style="text-align:center; color:var(--text-muted); font-size:0.72rem; margin:8px 0; font-weight:700;">
                                — O BIEN PEGAR RUTA / URL —
                            </div>

                            <div class="form-group" style="margin-bottom:14px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">URL o Ruta de la Foto (Opcional)</label>
                                <input type="text" id="new-news-image" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" placeholder="Ej: ./src/assets/multimedia/match-photo-1.jpg o https://...">
                            </div>

                            <!-- 4. DESCRIPCIÓN Y CONTENIDO -->
                            <div class="form-group" style="margin-bottom:20px;">
                                <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Descripción / Contenido *</label>
                                <textarea id="new-news-excerpt" rows="5" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; font-family:inherit; line-height:1.5;" placeholder="Escribe el artículo o resumen de la noticia..." required></textarea>
                            </div>

                            <button type="submit" class="btn btn-primary" style="width:100%; padding:12px; font-weight:700;">
                                📢 Publicar Noticia Oficial
                            </button>
                        </form>
                    </div>
                </div>
            `;
        }

        // Modal para editar noticia (Solo Admins)
        let editModalHtml = '';
        if (this.editingNewsId !== null && this.editingNewsId !== undefined) {
            const editingNews = teamData.news.find(n => n.id === this.editingNewsId);
            if (editingNews) {
                editModalHtml = `
                    <div class="modal-overlay active" id="edit-news-overlay">
                        <div class="glass-card" style="max-width:540px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease; max-height:90vh; overflow-y:auto;">
                            <button class="modal-close" id="close-edit-news-btn">✕</button>
                            <h3 style="font-size:1.4rem; margin-bottom:6px; display:flex; align-items:center; gap:8px;">
                                ✏️ Editar Noticia
                            </h3>
                            <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:20px;">
                                Modifica la noticia o elimínala del sistema.
                            </p>

                            <form id="form-edit-news">
                                <input type="hidden" id="edit-news-id" value="${editingNews.id}">

                                <div class="form-group" style="margin-bottom:14px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Titular de la Noticia *</label>
                                    <input type="text" id="edit-news-title" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" value="${editingNews.title}" required>
                                </div>

                                <div class="form-group" style="margin-bottom:14px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Fecha de Publicación *</label>
                                    <input type="text" id="edit-news-date" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" value="${editingNews.date || ''}" placeholder="Ej: 31/07/2026" required>
                                </div>

                                <div class="form-group" style="margin-bottom:12px; background:rgba(255,255,255,0.02); padding:12px; border:2px dashed var(--border-color-glow); border-radius:4px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--club-primary); display:block; margin-bottom:6px;">
                                        📁 Cambiar Foto desde tu Dispositivo (.jpg, .png, .webp)
                                    </label>
                                    <input type="file" id="edit-news-file" class="form-input" accept="image/*" style="width:100%; padding:6px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; cursor:pointer;">
                                </div>

                                <div style="text-align:center; color:var(--text-muted); font-size:0.72rem; margin:8px 0; font-weight:700;">
                                    — O BIEN URL DE LA FOTO —
                                </div>

                                <div class="form-group" style="margin-bottom:14px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">URL o Ruta de la Foto</label>
                                    <input type="text" id="edit-news-image" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" value="${editingNews.image || ''}" placeholder="Ej: ./src/assets/multimedia/match-photo-1.jpg">
                                </div>

                                <div class="form-group" style="margin-bottom:20px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Descripción / Contenido *</label>
                                    <textarea id="edit-news-excerpt" rows="5" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff; font-family:inherit; line-height:1.5;" required>${editingNews.excerpt}</textarea>
                                </div>

                                <div style="display:flex; gap:12px;">
                                    <button type="submit" class="btn btn-primary" style="flex:1; padding:12px; font-weight:700;">
                                        💾 Guardar Cambios
                                    </button>
                                    <button type="button" id="btn-delete-from-modal" class="btn" style="background:rgba(255,68,68,0.2); border:1px solid #ff4444; color:#ff4444; padding:12px; font-weight:700; cursor:pointer;">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
            }
        }

        return `
            <div class="container" style="padding-top:24px; padding-bottom:80px;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; margin-bottom:28px;">
                    <div>
                        <h2 class="section-title" style="margin:0; font-size:1.8rem;">NOTICIAS DEL CLUB</h2>
                    </div>

                    ${canEdit ? `
                        <button class="btn btn-primary" id="btn-open-create-news" style="padding:10px 18px; font-size:0.88rem; font-weight:700;">
                            ➕ Añadir Noticia (Admin)
                        </button>
                    ` : ''}
                </div>
                
                <div class="squad-grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap:24px;">
                    ${newsCardsHtml}
                </div>
            </div>

            ${newsModalHtml}
            ${createModalHtml}
            ${editModalHtml}
        `;
    },

    bindEvents() {
        // Abrir modal de creación (Admin)
        const btnOpenCreate = document.getElementById('btn-open-create-news');
        if (btnOpenCreate) {
            btnOpenCreate.addEventListener('click', () => {
                this.showCreateModal = true;
                state.notify();
            });
        }

        // Cerrar modal de creación
        const closeCreateBtn = document.getElementById('close-create-news-btn');
        const createOverlay = document.getElementById('create-news-overlay');
        const closeCreate = () => {
            this.showCreateModal = false;
            state.notify();
        };

        if (closeCreateBtn) closeCreateBtn.addEventListener('click', closeCreate);
        if (createOverlay) {
            createOverlay.addEventListener('click', (e) => {
                if (e.target === createOverlay) closeCreate();
            });
        }

        // Formulario de publicación (Admin)
        const formCreate = document.getElementById('form-create-news');
        if (formCreate) {
            formCreate.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('new-news-title').value.trim();
                const rawDate = document.getElementById('new-news-date').value;
                const fileInput = document.getElementById('new-news-file');
                const urlImage = document.getElementById('new-news-image').value.trim();
                const excerpt = document.getElementById('new-news-excerpt').value.trim();

                let formattedDate = rawDate || 'Reciente';
                if (rawDate && rawDate.includes('-')) {
                    const parts = rawDate.split('-');
                    if (parts.length === 3) {
                        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    }
                }

                const createNewsItem = (imgSrc) => {
                    if (title && excerpt) {
                        teamData.news.unshift({
                            id: Date.now(),
                            title: title,
                            date: formattedDate,
                            image: imgSrc,
                            excerpt: excerpt,
                            emoji: '📰'
                        });

                        saveNewsToStorage();
                        this.showCreateModal = false;
                        state.notify();
                    }
                };

                if (fileInput && fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        createNewsItem(evt.target.result);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    createNewsItem(urlImage);
                }
            });
        }

        // Abrir modal de edición (Admin)
        document.querySelectorAll('.btn-edit-news').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const editId = parseInt(btn.getAttribute('data-edit-id'));
                this.editingNewsId = editId;
                state.notify();
            });
        });

        // Cerrar modal de edición
        const closeEditBtn = document.getElementById('close-edit-news-btn');
        const editOverlay = document.getElementById('edit-news-overlay');
        const closeEdit = () => {
            this.editingNewsId = null;
            state.notify();
        };

        if (closeEditBtn) closeEditBtn.addEventListener('click', closeEdit);
        if (editOverlay) {
            editOverlay.addEventListener('click', (e) => {
                if (e.target === editOverlay) closeEdit();
            });
        }

        // Formulario de edición (Guardar cambios)
        const formEdit = document.getElementById('form-edit-news');
        if (formEdit) {
            formEdit.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('edit-news-id').value);
                const article = teamData.news.find(n => n.id === id);
                const fileInput = document.getElementById('edit-news-file');
                const urlImage = document.getElementById('edit-news-image').value.trim();

                const updateNewsItem = (imgSrc) => {
                    if (article) {
                        article.title = document.getElementById('edit-news-title').value.trim();
                        article.date = document.getElementById('edit-news-date').value.trim();
                        if (imgSrc) article.image = imgSrc;
                        article.excerpt = document.getElementById('edit-news-excerpt').value.trim();

                        saveNewsToStorage();
                        this.editingNewsId = null;
                        state.notify();
                    }
                };

                if (fileInput && fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                        updateNewsItem(evt.target.result);
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    updateNewsItem(urlImage || article.image);
                }
            });
        }

        // Botón Eliminar Noticia desde el modal de edición
        const btnDeleteFromModal = document.getElementById('btn-delete-from-modal');
        if (btnDeleteFromModal) {
            btnDeleteFromModal.addEventListener('click', () => {
                const id = parseInt(document.getElementById('edit-news-id').value);
                if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
                    teamData.news = teamData.news.filter(n => n.id !== id);
                    saveNewsToStorage();
                    this.editingNewsId = null;
                    state.notify();
                }
            });
        }

        // Clic en el botón "Leer Noticia" para abrir modal
        document.querySelectorAll('.btn-read-news').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const newsId = parseInt(btn.getAttribute('data-news-id'));
                state.update({ activeNewsId: newsId });
            });
        });

        // Cerrar modal de lectura
        const closeBtn = document.getElementById('close-news-btn');
        const overlay = document.getElementById('news-article-overlay');
        const closeModal = () => {
            state.update({ activeNewsId: null });
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeModal();
            });
        }
    }
};
