/* ==========================================
   FC HUB - VISTA MULTIMEDIA (VÍDEOS Y FOTOS CON EDICIÓN ADMIN Y SUBIDA DE CONTENIDO)
   ========================================== */

import { state } from '../state.js';
import { teamData, saveMediaToStorage } from '../data/teamData.js';
import { AuthService } from '../services/authService.js';
import { I } from './Icons.js';
import { LowerThird, ModalHead } from './ui.js';

export const MultimediaView = {
    activeTab: "videos", // videos, fotos
    showAddMediaModal: false,
    editingMediaId: null,

    render() {
        const canEdit = AuthService.hasPermission('edit_media') || AuthService.isAdmin();
        const videos = teamData.media.filter(m => m.type === 'video');
        const photos = teamData.media.filter(m => m.type === 'photo');
        const editBtn = m => canEdit
            ? `<button type="button" class="pg-btn pg-btn--icon pg-btn--xs media-card__edit btn-edit-media" data-media-id="${m.id}" title="Editar" aria-label="Editar">${I('edit')}</button>`
            : '';
        const tag = (prefix, i) => `${prefix} ${String(i + 1).padStart(2, '0')}`;

        const videosHtml = videos.map((v, i) => `
            <article class="media-card video-card" data-video-id="${v.id}" role="button" tabindex="0">
                <div class="media-card__frame">
                    ${v.image
                        ? `<img src="${v.image}" alt="" loading="lazy" />`
                        : `<video src="${v.videoUrl}#t=0.5" preload="metadata" muted playsinline></video>`}
                    <span class="media-card__osd media-card__osd--tl"><span class="pg-dot pg-dot--live"></span>${tag('Tape', i)}</span>
                    <span class="media-card__osd media-card__osd--br">${I('play')} Play</span>
                    <span class="media-card__play" aria-hidden="true">${I('play')}</span>
                </div>
                <div class="media-card__caption">
                    <h3 class="media-card__title">${v.title}</h3>
                    ${v.category ? `<span class="t-meta">${v.category}</span>` : ''}
                </div>
                ${editBtn(v)}
            </article>
        `).join('');

        const photosHtml = photos.map((p, i) => `
            <article class="media-card photo-card ${i === 0 ? 'photo-card--feature' : ''}" data-photo-id="${p.id}" role="button" tabindex="0">
                <div class="media-card__frame">
                    <img src="${p.image}" alt="${p.title}" loading="lazy" />
                    <span class="media-card__osd media-card__osd--tl">${tag('Foto', i)}</span>
                </div>
                <div class="media-card__caption">
                    <h3 class="media-card__title">${p.title}</h3>
                </div>
                ${editBtn(p)}
            </article>
        `).join('');

        let videoModalHtml = '';
        if (state.activeVideoId !== null && state.activeVideoId !== undefined) {
            const v = teamData.media.find(m => m.id === state.activeVideoId);
            if (v) {
                videoModalHtml = `
                    <div class="modal-overlay active media-viewer" id="video-player-overlay">
                        <div class="pg-modal pg-modal--xl video-player-modal">
                            ${ModalHead({ kicker: 'Media · Vídeo', title: v.title, closeId: 'close-video-btn' })}
                            <video class="html5-video-player" controls autoplay playsinline>
                                <source src="${v.videoUrl || ''}" type="video/mp4">
                                Tu navegador no soporta vídeo HTML5.
                            </video>
                        </div>
                    </div>
                `;
            }
        }

        let photoModalHtml = '';
        if (state.activePhotoId !== null && state.activePhotoId !== undefined) {
            const ph = teamData.media.find(m => m.id === state.activePhotoId);
            if (ph) {
                photoModalHtml = `
                    <div class="modal-overlay active media-viewer" id="photo-viewer-overlay">
                        <div class="pg-modal pg-modal--xl">
                            ${ModalHead({ kicker: 'Media · Fotografía', title: ph.title, closeId: 'close-photo-btn' })}
                            <img class="media-viewer__img" src="${ph.image}" alt="${ph.title}" />
                        </div>
                    </div>
                `;
            }
        }

        let addMediaModalHtml = '';
        if (this.showAddMediaModal) {
            addMediaModalHtml = `
                <div class="modal-overlay active" id="add-media-modal-overlay">
                    <div class="pg-modal">
                        ${ModalHead({ kicker: 'Admin · Media', title: 'Subir contenido', closeId: 'close-add-media-btn' })}
                        <form id="add-media-form" class="pg-form pg-modal__body">
                            <div class="pg-form__row">
                                <div class="pg-field">
                                    <label class="pg-label" for="input-media-type">Tipo *</label>
                                    <select id="input-media-type" class="pg-input">
                                        <option value="video" ${this.activeTab === 'videos' ? 'selected' : ''}>Vídeo</option>
                                        <option value="photo" ${this.activeTab === 'fotos' ? 'selected' : ''}>Fotografía</option>
                                    </select>
                                </div>
                                <div class="pg-field">
                                    <label class="pg-label" for="input-media-category">Categoría</label>
                                    <select id="input-media-category" class="pg-input">
                                        <option value="partidos">Partidos</option>
                                        <option value="fichajes">Fichajes</option>
                                        <option value="entrenos">Entrenamientos</option>
                                        <option value="entrevistas">Entrevistas</option>
                                    </select>
                                </div>
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="input-media-title">Título / pie de foto *</label>
                                <input type="text" id="input-media-title" class="pg-input" placeholder="Golazo de Rubén Montes #10" required />
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="input-media-file">Archivo (.mp4, .webm, .jpg, .png)</label>
                                <input type="file" id="input-media-file" class="pg-input" accept="video/*,image/*" />
                            </div>
                            <div class="pg-field">
                                <label class="pg-label" for="input-media-url">…o enlace URL</label>
                                <input type="url" id="input-media-url" class="pg-input" placeholder="https://…" />
                            </div>
                            <div class="pg-row" style="justify-content:flex-end">
                                <button type="button" class="pg-btn" id="cancel-add-media-btn">Cancelar</button>
                                <button type="submit" class="pg-btn pg-btn--primary">${I('upload')} Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        let editMediaModalHtml = '';
        if (this.editingMediaId !== null && this.editingMediaId !== undefined) {
            const m = teamData.media.find(x => x.id === this.editingMediaId);
            if (m) {
                editMediaModalHtml = `
                    <div class="modal-overlay active" id="edit-media-overlay">
                        <div class="pg-modal">
                            ${ModalHead({ kicker: 'Admin · Media', title: m.type === 'video' ? 'Editar vídeo' : 'Editar foto', closeId: 'close-edit-media-btn' })}
                            <form id="form-edit-media" class="pg-form pg-modal__body">
                                <input type="hidden" id="edit-media-id" value="${m.id}">
                                <div class="pg-field">
                                    <label class="pg-label" for="edit-media-title">Título / pie de foto *</label>
                                    <input type="text" id="edit-media-title" class="pg-input" value="${m.title}" required>
                                </div>
                                <div class="pg-row">
                                    <button type="submit" class="pg-btn pg-btn--primary" style="flex:1">${I('check')} Guardar</button>
                                    <button type="button" id="btn-delete-media" class="pg-btn pg-btn--danger">${I('trash')} Eliminar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
            }
        }

        const isVideos = this.activeTab === 'videos';
        const list = isVideos ? videos : photos;

        return `
            <div class="pg-view">
                ${LowerThird({
                    page: 'multimedia',
                    title: 'Media',
                    sub: `${videos.length} vídeos · ${photos.length} fotografías · Archivo del club`,
                    actions: canEdit ? `<button type="button" class="pg-btn pg-btn--primary" id="btn-open-add-media">${I('upload')} Subir contenido</button>` : ''
                })}

                <div class="pg-tabs media-tabs" role="tablist">
                    <button type="button" role="tab" class="pg-tab ${isVideos ? 'is-active' : ''}" id="tab-btn-videos" aria-selected="${isVideos}">Vídeos <span class="t-mute">${videos.length}</span></button>
                    <button type="button" role="tab" class="pg-tab ${!isVideos ? 'is-active' : ''}" id="tab-btn-fotos" aria-selected="${!isVideos}">Fotografías <span class="t-mute">${photos.length}</span></button>
                </div>

                ${list.length
                    ? `<div class="${isVideos ? 'media-grid' : 'media-grid media-grid--photos'}">${isVideos ? videosHtml : photosHtml}</div>`
                    : `<div class="pg-empty">Sin ${isVideos ? 'vídeos' : 'fotografías'} todavía</div>`}
            </div>

            ${videoModalHtml}
            ${photoModalHtml}
            ${addMediaModalHtml}
            ${editMediaModalHtml}
        `;
    },

    bindEvents() {
        const tabVideos = document.getElementById('tab-btn-videos');
        const tabFotos = document.getElementById('tab-btn-fotos');

        if (tabVideos) {
            tabVideos.addEventListener('click', () => {
                this.activeTab = "videos";
                state.notify();
            });
        }
        if (tabFotos) {
            tabFotos.addEventListener('click', () => {
                this.activeTab = "fotos";
                state.notify();
            });
        }

        const btnOpenAdd = document.getElementById('btn-open-add-media');
        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => {
                this.showAddMediaModal = true;
                state.notify();
            });
        }

        const closeAddBtn = document.getElementById('close-add-media-btn');
        const cancelAddBtn = document.getElementById('cancel-add-media-btn');
        const closeAddModal = () => {
            this.showAddMediaModal = false;
            state.notify();
        };

        if (closeAddBtn) closeAddBtn.addEventListener('click', closeAddModal);
        if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

        // Formulario subir multimedia (Vídeos o Fotografías)
        const addForm = document.getElementById('add-media-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const type = document.getElementById('input-media-type').value;
                const title = document.getElementById('input-media-title').value.trim();
                const category = document.getElementById('input-media-category').value;
                const fileInput = document.getElementById('input-media-file');
                const urlInput = document.getElementById('input-media-url').value.trim();

                const processAndSave = (src) => {
                    const newMedia = {
                        id: Date.now(),
                        type: type,
                        title: title,
                        category: category,
                        views: 0
                    };

                    if (type === 'video') {
                        newMedia.videoUrl = src;
                        this.activeTab = 'videos';
                    } else {
                        newMedia.image = src;
                        this.activeTab = 'fotos';
                    }

                    teamData.media.unshift(newMedia);
                    saveMediaToStorage();
                    this.showAddMediaModal = false;
                    state.notify();
                };

                if (fileInput && fileInput.files && fileInput.files[0]) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        processAndSave(event.target.result);
                    };
                    reader.readAsDataURL(file);
                } else if (urlInput) {
                    processAndSave(urlInput);
                } else {
                    alert('Por favor selecciona un archivo de tu equipo o introduce una URL.');
                }
            });
        }

        // Abrir modal de edición (Admin)
        document.querySelectorAll('.btn-edit-media').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mediaId = parseInt(btn.getAttribute('data-media-id'));
                this.editingMediaId = mediaId;
                state.notify();
            });
        });

        // Cerrar modal de edición
        const closeEditMediaBtn = document.getElementById('close-edit-media-btn');
        const editMediaOverlay = document.getElementById('edit-media-overlay');
        const closeEditMedia = () => {
            this.editingMediaId = null;
            state.notify();
        };

        if (closeEditMediaBtn) closeEditMediaBtn.addEventListener('click', closeEditMedia);
        if (editMediaOverlay) {
            editMediaOverlay.addEventListener('click', (e) => {
                if (e.target === editMediaOverlay) closeEditMedia();
            });
        }

        // Formulario de edición
        const formEditMedia = document.getElementById('form-edit-media');
        if (formEditMedia) {
            formEditMedia.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(document.getElementById('edit-media-id').value);
                const mediaItem = teamData.media.find(m => m.id === id);
                if (mediaItem) {
                    mediaItem.title = document.getElementById('edit-media-title').value.trim();
                    saveMediaToStorage();
                    this.editingMediaId = null;
                    state.notify();
                }
            });
        }

        // Eliminar elemento de media desde modal de edición
        const btnDeleteMedia = document.getElementById('btn-delete-media');
        if (btnDeleteMedia) {
            btnDeleteMedia.addEventListener('click', () => {
                const id = parseInt(document.getElementById('edit-media-id').value);
                if (confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
                    teamData.media = teamData.media.filter(m => m.id !== id);
                    saveMediaToStorage();
                    this.editingMediaId = null;
                    state.notify();
                }
            });
        }

        document.querySelectorAll('.media-card').forEach(card => {
            card.addEventListener('keydown', (e) => { if (e.key === 'Enter' && e.target === card) card.click(); });
        });

        // Reproductor de vídeos
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-edit-media')) return;
                const vId = parseInt(card.getAttribute('data-video-id'));
                state.update({ activeVideoId: vId });
            });
        });

        const closeVideoBtn = document.getElementById('close-video-btn');
        const videoOverlay = document.getElementById('video-player-overlay');
        const closeVideo = () => {
            state.update({ activeVideoId: null });
        };
        if (closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
        if (videoOverlay) {
            videoOverlay.addEventListener('click', (e) => {
                if (e.target === videoOverlay) closeVideo();
            });
        }

        // Visor de fotos
        document.querySelectorAll('.photo-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.btn-edit-media')) return;
                const pId = parseInt(card.getAttribute('data-photo-id'));
                state.update({ activePhotoId: pId });
            });
        });

        const closePhotoBtn = document.getElementById('close-photo-btn');
        const photoOverlay = document.getElementById('photo-viewer-overlay');
        const closePhoto = () => {
            state.update({ activePhotoId: null });
        };
        if (closePhotoBtn) closePhotoBtn.addEventListener('click', closePhoto);
        if (photoOverlay) {
            photoOverlay.addEventListener('click', (e) => {
                if (e.target === photoOverlay) closePhoto();
            });
        }
    }
};
