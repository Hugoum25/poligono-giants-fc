/* ==========================================
   FC HUB - VISTA DE NOTICIAS CON EDICIÓN Y ELIMINACIÓN ADMIN
   ========================================== */

import { state } from '../state.js';
import { teamData, saveNewsToStorage } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead } from './ui.js';

export const NewsView = {
    showCreateModal: false,
    editingNewsId: null,

    render() {
        const canEdit = AuthService.hasPermission('edit_news');
        const news = teamData.news || [];
        const today = (() => {
            const d = new Date();
            return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        })();

        const media = (item, cls) => (item.image && item.image.trim())
            ? `<div class="${cls}"><img src="${item.image}" alt="" loading="lazy" onerror="this.parentNode.classList.add('is-empty');this.remove();" /></div>`
            : `<div class="${cls} is-empty"></div>`;

        const editBtn = item => canEdit
            ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs news-card__edit btn-edit-news" data-edit-id="${item.id}" title="Editar noticia" aria-label="Editar noticia">${I('edit')}</button>`
            : '';

        const card = (item, i) => `
            <article class="news-card ${i === 0 ? 'news-card--lead' : ''} btn-read-news" data-news-id="${item.id}" role="button" tabindex="0">
                ${media(item, 'news-card__media')}
                <div class="news-card__body">
                    <div class="news-card__meta t-meta">
                        <span class="t-signal">Nº ${String(news.length - i).padStart(3, '0')}</span>
                        <span>${item.date || 'Reciente'}</span>
                    </div>
                    <h2 class="news-card__title">${item.title}</h2>
                    ${i === 0 && item.excerpt ? `<p class="news-card__excerpt">${item.excerpt.split('\n')[0]}</p>` : ''}
                    <span class="news-card__more t-meta">Leer ${I('arrowR')}</span>
                </div>
                ${editBtn(item)}
            </article>
        `;

        // Lector
        let newsModalHtml = '';
        if (state.activeNewsId !== null && state.activeNewsId !== undefined) {
            const article = news.find(n => n.id === state.activeNewsId);
            if (article) {
                newsModalHtml = `
                    <div class="modal-overlay active" id="news-article-overlay">
                        <article class="pg-modal pg-modal--md news-reader">
                            ${ModalHead({ kicker: `Noticias · ${article.date || 'Reciente'}`, title: '', closeId: 'close-news-btn' })}
                            ${article.image && article.image.trim() ? `<img class="news-reader__img" src="${article.image}" alt="" />` : ''}
                            <div class="pg-modal__body">
                                <h2 class="news-reader__title">${article.title}</h2>
                                <div class="news-reader__text">
                                    ${(article.excerpt || '').split('\n').filter(p => p.trim()).map(p => `<p>${p}</p>`).join('')}
                                </div>
                            </div>
                        </article>
                    </div>
                `;
            }
        }

        const imageFields = (prefix, current = '') => `
            <div class="pg-field">
                <label class="pg-label" for="${prefix}-news-file">Foto desde tu dispositivo</label>
                <input type="file" id="${prefix}-news-file" class="pg-input" accept="image/*">
            </div>
            <div class="pg-field">
                <label class="pg-label" for="${prefix}-news-image">…o URL / ruta de la foto</label>
                <input type="text" id="${prefix}-news-image" class="pg-input" value="${current}" placeholder="./src/assets/multimedia/match-photo-1.jpg o https://…">
            </div>
        `;

        let createModalHtml = '';
        if (this.showCreateModal) {
            createModalHtml = `
                <div class="modal-overlay active" id="create-news-overlay">
                    <div class="pg-modal">
                        ${ModalHead({ kicker: 'Admin · Noticias', title: 'Publicar noticia', closeId: 'close-create-news-btn' })}
                        <form id="form-create-news" class="pg-form pg-modal__body">
                            <div class="pg-field">
                                <label class="pg-label" for="new-news-title">Titular *</label>
                                <input type="text" id="new-news-title" class="pg-input" placeholder="Nueva victoria de Polígono Giants" required>
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="new-news-date">Fecha de publicación (automática)</label>
                                <input type="text" id="new-news-date" class="pg-input" value="${today}" readonly>
                            </div>
                            ${imageFields('new')}
                            <div class="pg-field">
                                <label class="pg-label" for="new-news-excerpt">Contenido *</label>
                                <textarea id="new-news-excerpt" class="pg-input" rows="6" placeholder="Escribe el artículo…" required></textarea>
                            </div>
                            <button type="submit" class="pg-btn pg-btn--primary pg-btn--block">${I('send')} Publicar noticia</button>
                        </form>
                    </div>
                </div>
            `;
        }

        let editModalHtml = '';
        if (this.editingNewsId !== null && this.editingNewsId !== undefined) {
            const n = news.find(x => x.id === this.editingNewsId);
            if (n) {
                editModalHtml = `
                    <div class="modal-overlay active" id="edit-news-overlay">
                        <div class="pg-modal">
                            ${ModalHead({ kicker: 'Admin · Noticias', title: 'Editar noticia', closeId: 'close-edit-news-btn' })}
                            <form id="form-edit-news" class="pg-form pg-modal__body">
                                <input type="hidden" id="edit-news-id" value="${n.id}">
                                <div class="pg-field">
                                    <label class="pg-label" for="edit-news-title">Titular *</label>
                                    <input type="text" id="edit-news-title" class="pg-input" value="${n.title}" required>
                                </div>
                                <div class="pg-field">
                                    <label class="pg-label" for="edit-news-date">Fecha *</label>
                                    <input type="text" id="edit-news-date" class="pg-input" value="${n.date || ''}" placeholder="31/07/2026" required>
                                </div>
                                ${imageFields('edit', n.image && !n.image.startsWith('data:') ? n.image : '')}
                                <div class="pg-field">
                                    <label class="pg-label" for="edit-news-excerpt">Contenido *</label>
                                    <textarea id="edit-news-excerpt" class="pg-input" rows="6" required>${n.excerpt}</textarea>
                                </div>
                                <div class="pg-row">
                                    <button type="submit" class="pg-btn pg-btn--primary" style="flex:1">${I('check')} Guardar cambios</button>
                                    <button type="button" id="btn-delete-from-modal" class="pg-btn pg-btn--danger">${I('trash')} Eliminar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
            }
        }

        const actions = canEdit
            ? `<button class="pg-btn pg-btn--primary" id="btn-open-create-news">${I('plus')} Nueva noticia</button>`
            : '';

        return `
            <div class="pg-view">
                ${LowerThird({ page: 'news', title: 'Noticias', sub: `${news.length} piezas · Última actualización ${news[0] && news[0].date ? news[0].date : '—'}`, actions })}
                ${news.length
                    ? `<div class="news-grid">${news.map(card).join('')}</div>`
                    : `<div class="pg-empty">Sin noticias en emisión</div>`}
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
            const open = (e) => {
                if (e.target.closest('.btn-edit-news')) return;
                e.stopPropagation();
                const newsId = parseInt(btn.getAttribute('data-news-id'));
                state.update({ activeNewsId: newsId });
            };
            btn.addEventListener('click', open);
            btn.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(e); });
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
