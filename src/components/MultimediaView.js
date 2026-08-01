/* ==========================================
   FC HUB - VISTA MULTIMEDIA (VÍDEOS Y FOTOS CON EDICIÓN ADMIN)
   ========================================== */

import { state } from '../state.js';
import { teamData, saveMediaToStorage } from '../data/teamData.js';
import { Icon3D } from './Icon3D.js';
import { AuthService } from '../services/authService.js';

export const MultimediaView = {
    activeTab: "videos", // videos, fotos
    showAddVideoModal: false,
    editingMediaId: null,

    render() {
        const canEdit = AuthService.hasPermission('edit_media') || AuthService.isAdmin();
        const videos = teamData.media.filter(m => m.type === 'video');
        const photos = teamData.media.filter(m => m.type === 'photo');

        const videosHtml = videos.map(v => `
            <div class="glass-card media-card video-card" data-video-id="${v.id}" style="padding:12px; position:relative;">
                ${canEdit ? `
                    <button class="btn-edit-media" data-media-id="${v.id}" title="Editar Título (Admin)" style="position:absolute; top:8px; right:8px; z-index:10; background:rgba(255,255,255,0.15); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:3px 7px; font-size:0.8rem; cursor:pointer;">
                        ✏️
                    </button>
                ` : ''}

                <div class="media-thumbnail-wrapper" style="height:160px; background:#0b0d18; border-radius:4px; overflow:hidden; position:relative;">
                    ${v.image ? `
                        <img src="${v.image}" style="width:100%; height:100%; object-fit:cover;" />
                    ` : `
                        <video src="${v.videoUrl}#t=0.5" preload="metadata" style="width:100%; height:100%; object-fit:cover; pointer-events:none;" muted></video>
                    `}
                    <div class="media-play-overlay">▶</div>
                </div>
                <div style="padding-top:10px; text-align:center;">
                    <h4 style="font-size:0.95rem; margin:0; line-height:1.3; font-weight:600;">${v.title}</h4>
                </div>
            </div>
        `).join('');

        const photosHtml = photos.map(p => `
            <div class="glass-card media-card photo-card" data-photo-id="${p.id}" style="padding:12px; position:relative;">
                ${canEdit ? `
                    <button class="btn-edit-media" data-media-id="${p.id}" title="Editar Pie de Foto (Admin)" style="position:absolute; top:8px; right:8px; z-index:10; background:rgba(255,255,255,0.15); border:1px solid var(--border-color); color:#fff; border-radius:4px; padding:3px 7px; font-size:0.8rem; cursor:pointer;">
                        ✏️
                    </button>
                ` : ''}

                <div class="media-thumbnail-wrapper" style="height:170px; border-radius:4px; overflow:hidden;">
                    <img src="${p.image}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover; display:block;" />
                    <div class="media-zoom-overlay">🔍</div>
                </div>
                <div style="padding-top:10px; text-align:center;">
                    <h4 style="font-size:0.95rem; margin:0; line-height:1.3; font-weight:600;">${p.title}</h4>
                </div>
            </div>
        `).join('');

        // Modal reproductor de vídeo
        let videoModalHtml = '';
        if (state.activeVideoId !== null) {
            const activeVideo = teamData.media.find(m => m.id === state.activeVideoId);
            if (activeVideo) {
                videoModalHtml = `
                    <div class="modal-overlay active" id="video-player-overlay">
                        <div class="glass-card video-player-modal">
                            <button class="modal-close" id="close-video-btn">✕</button>
                            <div class="video-container-wrapper">
                                <video class="html5-video-player" controls autoplay poster="">
                                    <source src="${activeVideo.videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4'}" type="video/mp4">
                                    Tu navegador no soporta reproductor HTML5.
                                </video>
                            </div>
                            <div style="margin-top:14px; text-align:center;">
                                <h3 style="font-size:1.1rem; margin:0;">${activeVideo.title}</h3>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // Modal de foto
        let photoModalHtml = '';
        if (state.activePhotoId !== null) {
            const activePhoto = teamData.media.find(m => m.id === state.activePhotoId);
            if (activePhoto) {
                photoModalHtml = `
                    <div class="modal-overlay active" id="photo-viewer-overlay">
                        <div class="glass-card" style="max-width:820px; width:100%; padding:24px; text-align:center; position:relative; animation:slideUp 0.35s ease;">
                            <button class="modal-close" id="close-photo-btn">✕</button>
                            <div style="margin-bottom:14px; max-height:500px; overflow:hidden; border-radius:var(--radius-md); border:1px solid var(--border-color); background:#000;">
                                <img src="${activePhoto.image}" alt="${activePhoto.title}" style="width:100%; max-height:500px; object-fit:contain; display:block; margin:0 auto;" />
                            </div>
                            <h3 style="font-size:1.1rem; margin:0;">${activePhoto.title}</h3>
                        </div>
                    </div>
                `;
            }
        }

        // Modal de añadir vídeo (Local / Enlace)
        let addVideoModalHtml = '';
        if (this.showAddVideoModal) {
            addVideoModalHtml = `
                <div class="modal-overlay active" id="add-video-modal-overlay">
                    <div class="glass-card customizer-card" style="max-width:540px; width:100%; padding:28px; position:relative; animation:slideUp 0.35s ease;">
                        <button class="modal-close" id="close-add-video-btn">✕</button>
                        <h3 style="font-size:1.4rem; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
                            ${Icon3D.render('🎥', 'sm')} Subir / Añadir Vídeo
                        </h3>
                        <form id="add-video-form">
                            <div class="form-group">
                                <label>Título del Vídeo</label>
                                <input type="text" id="input-video-title" class="form-input" placeholder="Ej: Golazo de Rubén Montes #10 vs Galácticos" required />
                            </div>
                            <div class="form-group">
                                <label>Categoría</label>
                                <select id="input-video-category" class="form-input" style="background:#0e1120;">
                                    <option value="partidos">Partidos</option>
                                    <option value="jugadas">Mejores Jugadas</option>
                                    <option value="entrenos">Entrenamientos</option>
                                    <option value="entrevistas">Entrevistas</option>
                                </select>
                            </div>
                            
                            <div class="form-group" style="background:rgba(255,255,255,0.02); padding:12px; border:2px dashed var(--border-color-glow); border-radius:4px;">
                                <label style="color:var(--club-primary); font-weight:700;">📁 Opción A: Subir Archivo desde tu Equipo (.mp4, .mov, .webm)</label>
                                <input type="file" id="input-video-file" class="form-input" accept="video/*" style="padding:8px; margin-top:6px; cursor:pointer;" />
                            </div>

                            <div style="text-align:center; color:var(--text-muted); font-size:0.75rem; margin:10px 0; font-weight:700;">
                                — O BIEN —
                            </div>

                            <div class="form-group">
                                <label>🌐 Opción B: Enlace de Vídeo (URL MP4 / Web)</label>
                                <input type="url" id="input-video-url" class="form-input" placeholder="https://..." />
                            </div>
                            <div class="form-group">
                                <label>Duración (mm:ss)</label>
                                <input type="text" id="input-video-duration" class="form-input" placeholder="02:30" value="02:30" />
                            </div>
                            <div style="display:flex; gap:12px; margin-top:20px;">
                                <button type="submit" class="btn btn-primary" style="flex:1;">Guardar y Reproducir</button>
                                <button type="button" class="btn btn-secondary" id="cancel-add-video-btn">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
        }

        // Modal para editar media (Solo Admins)
        let editMediaModalHtml = '';
        if (this.editingMediaId !== null && this.editingMediaId !== undefined) {
            const editingMedia = teamData.media.find(m => m.id === this.editingMediaId);
            if (editingMedia) {
                const isVideo = editingMedia.type === 'video';
                editMediaModalHtml = `
                    <div class="modal-overlay active" id="edit-media-overlay">
                        <div class="glass-card" style="max-width:500px; width:100%; padding:28px; position:relative; animation:slideUp 0.3s ease;">
                            <button class="modal-close" id="close-edit-media-btn">✕</button>
                            <h3 style="font-size:1.3rem; margin-bottom:16px;">
                                ✏️ Editar Pie de ${isVideo ? 'Vídeo' : 'Foto'}
                            </h3>
                            <form id="form-edit-media">
                                <input type="hidden" id="edit-media-id" value="${editingMedia.id}">
                                
                                <div class="form-group" style="margin-bottom:16px;">
                                    <label style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:4px;">Título / Pie de Foto *</label>
                                    <input type="text" id="edit-media-title" class="form-input" style="width:100%; padding:10px; border-radius:4px; background:var(--bg-dark); border:1px solid var(--border-color); color:#fff;" value="${editingMedia.title}" required>
                                </div>

                                <div style="display:flex; gap:12px;">
                                    <button type="submit" class="btn btn-primary" style="flex:1; padding:10px; font-weight:700;">
                                        💾 Guardar
                                    </button>
                                    <button type="button" id="btn-delete-media" class="btn" style="background:rgba(255,68,68,0.2); border:1px solid #ff4444; color:#ff4444; padding:10px; font-weight:700; cursor:pointer;">
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
                ${canEdit ? `
                    <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:16px;">
                        <button class="btn btn-primary" id="btn-open-add-video" style="padding:6px 12px; font-size:0.75rem; font-weight:700;">
                            Añadir Vídeo
                        </button>
                    </div>
                ` : ''}
                
                <div class="squad-filters" style="margin-bottom:28px;">
                    <button class="filter-btn ${this.activeTab === 'videos' ? 'active' : ''}" id="tab-btn-videos">
                        Vídeos (${videos.length})
                    </button>
                    <button class="filter-btn ${this.activeTab === 'fotos' ? 'active' : ''}" id="tab-btn-fotos">
                        Fotografías (${photos.length})
                    </button>
                </div>

                ${this.activeTab === 'videos' ? `
                    <div class="squad-grid" style="grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap:20px;">
                        ${videosHtml}
                    </div>
                ` : `
                    <div class="squad-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap:20px;">
                        ${photosHtml}
                    </div>
                `}
            </div>

            ${videoModalHtml}
            ${photoModalHtml}
            ${addVideoModalHtml}
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

        const btnOpenAdd = document.getElementById('btn-open-add-video');
        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => {
                this.showAddVideoModal = true;
                state.notify();
            });
        }

        const closeAddBtn = document.getElementById('close-add-video-btn');
        const cancelAddBtn = document.getElementById('cancel-add-video-btn');
        const closeAddModal = () => {
            this.showAddVideoModal = false;
            state.notify();
        };

        if (closeAddBtn) closeAddBtn.addEventListener('click', closeAddModal);
        if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

        const addForm = document.getElementById('add-video-form');
        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('input-video-title').value;
                const category = document.getElementById('input-video-category').value;
                const fileInput = document.getElementById('input-video-file');
                const urlInput = document.getElementById('input-video-url').value;
                const duration = document.getElementById('input-video-duration').value || '03:00';

                let videoSrc = urlInput;
                if (fileInput && fileInput.files && fileInput.files[0]) {
                    videoSrc = URL.createObjectURL(fileInput.files[0]);
                }

                if (!videoSrc) {
                    videoSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
                }

                const newMedia = {
                    id: Date.now(),
                    type: 'video',
                    title: title,
                    category: category,
                    duration: duration,
                    videoUrl: videoSrc,
                    thumbnail: '🎥',
                    views: '1'
                };

                teamData.media.unshift(newMedia);
                saveMediaToStorage();
                this.showAddVideoModal = false;
                state.notify();
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
            photoModalHtml && photoOverlay.addEventListener('click', (e) => {
                if (e.target === photoOverlay) closePhoto();
            });
        }
    }
};
