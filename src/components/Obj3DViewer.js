/* ==========================================
   FC HUB - RENDERIZADOR 3D DE ARCHIVOS .OBJ AUTÓNOMO CON CACHÉ INSTANTÁNEA
   ========================================== */

export const Obj3DViewer = {
    activeAnimators: new Map(),
    objCache: new Map(), // Cache en memoria para 0ms de retardo al re-renderizar

    /**
     * Escanea todo el DOM e inicializa automáticamente los visores 3D para contenedores con clase .obj-3d-canvas-container
     */
    initAll() {
        requestAnimationFrame(() => {
            document.querySelectorAll('.obj-3d-canvas-container').forEach(el => {
                const path = el.getAttribute('data-obj-path') || './src/assets/media-icon.obj';
                const width = parseInt(el.getAttribute('data-width')) || el.clientWidth || 72;
                const height = parseInt(el.getAttribute('data-height')) || el.clientHeight || 72;
                const speedAttr = el.getAttribute('data-rotate-speed');
                const autoRotateSpeed = speedAttr !== null ? parseFloat(speedAttr) : 0.085;
                const rotateAxis = el.getAttribute('data-rotate-axis') || 'y';
                const tiltAttr = el.getAttribute('data-tilt-x');
                const fixedTiltX = tiltAttr !== null ? parseFloat(tiltAttr) : 0;
                this.init(el, path, { width, height, autoRotateSpeed, fixedTiltX, rotateAxis });
            });
        });
    },

    /**
     * Parsea un archivo .OBJ en vértices y caras
     */
    parseOBJ(text) {
        const vertices = [];
        const faces = [];

        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('v ')) {
                const parts = line.split(/\s+/).slice(1).map(Number);
                if (parts.length >= 3) {
                    vertices.push({ x: parts[0], y: parts[1], z: parts[2] });
                }
            } else if (line.startsWith('f ')) {
                const parts = line.split(/\s+/).slice(1);
                const faceIndices = parts.map(p => parseInt(p.split('/')[0]) - 1).filter(idx => !isNaN(idx) && idx >= 0);
                
                // Triangular polígonos
                for (let j = 1; j < faceIndices.length - 1; j++) {
                    faces.push([faceIndices[0], faceIndices[j], faceIndices[j + 1]]);
                }
            }
        }

        // Centrar y normalizar vértices
        if (vertices.length > 0) {
            let minX = Infinity, maxX = -Infinity;
            let minY = Infinity, maxY = -Infinity;
            let minZ = Infinity, maxZ = -Infinity;

            vertices.forEach(v => {
                if (v.x < minX) minX = v.x; if (v.x > maxX) maxX = v.x;
                if (v.y < minY) minY = v.y; if (v.y > maxY) maxY = v.y;
                if (v.z < minZ) minZ = v.z; if (v.z > maxZ) maxZ = v.z;
            });

            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const cz = (minZ + maxZ) / 2;

            const sizeX = maxX - minX;
            const sizeY = maxY - minY;
            const sizeZ = maxZ - minZ;
            const maxDim = Math.max(sizeX, sizeY, sizeZ) || 1;

            vertices.forEach(v => {
                v.x = (v.x - cx) / maxDim;
                v.y = (v.y - cy) / maxDim;
                v.z = (v.z - cz) / maxDim;
            });
        }

        return { vertices, faces };
    },

    /**
     * Inicializa un renderizador Canvas 3D de alta compatibilidad para cargar y rotar cualquier .obj
     */
    init(containerEl, objPath = './src/assets/media-icon.obj', options = {}) {
        if (!containerEl) return;

        // Cancelar animación previa en este contenedor si existía
        this.destroy(containerEl);

        const width = options.width || containerEl.clientWidth || 72;
        const height = options.height || containerEl.clientHeight || 72;

        const canvas = document.createElement('canvas');
        canvas.width = width * 2; // Retina resolution
        canvas.height = height * 2;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.style.display = 'block';
        containerEl.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let modelData = this.objCache.get(objPath) || null;
        let rotY = 0;
        let rotX = 0;
        let rotZ = 0;
        let animId = null;

        // Si no está en caché, hacer fetch y guardar en caché para futuros re-renders instantáneos
        if (!modelData) {
            fetch(objPath)
                .then(res => {
                    if (!res.ok) throw new Error('HTTP status ' + res.status);
                    return res.text();
                })
                .then(text => {
                    modelData = this.parseOBJ(text);
                    this.objCache.set(objPath, modelData);
                })
                .catch(err => {
                    console.error('[Obj3DViewer] Error cargando .OBJ:', err);
                });
        }

        // Bucle de renderizado Canvas 3D
        const renderFrame = () => {
            animId = requestAnimationFrame(renderFrame);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Buscar en caché si aún no se ha asignado localmente
            if (!modelData && this.objCache.has(objPath)) {
                modelData = this.objCache.get(objPath);
            }

            if (!modelData || modelData.vertices.length === 0) return;

            const speed = options.autoRotateSpeed !== undefined ? options.autoRotateSpeed : 0.085;

            if (speed !== 0) {
                if (options.rotateAxis === 'z') {
                    rotZ += speed; // Rotación continua en el eje Z para el mando
                    rotX = options.fixedTiltX !== undefined ? options.fixedTiltX : 0;
                    rotY = 0;
                } else if (options.rotateAxis === 'x') {
                    rotX += speed; // Rotación continua en eje X
                    rotZ = 0;
                } else if (options.rotateAxis === 'both') {
                    rotY += speed;
                    rotX += speed;
                    rotZ = 0;
                } else {
                    rotY += speed; // Rotación continua uniforme en eje Y
                    rotX = options.fixedTiltX !== undefined ? options.fixedTiltX : 0;
                    rotZ = 0;
                }
            } else {
                rotX = options.fixedTiltX !== undefined ? options.fixedTiltX : 0;
                rotY = 0;
                rotZ = 0;
            }

            const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);
            const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
            const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

            const scale = Math.min(canvas.width, canvas.height) * 0.48;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // 1. Transformar y proyectar vértices con rotación Z, Y, X
            const transformedVerts = modelData.vertices.map(v => {
                // Rotar Z
                let x0 = v.x * cosZ - v.y * sinZ;
                let y0 = v.x * sinZ + v.y * cosZ;
                let z0 = v.z;

                // Rotar Y
                let x1 = x0 * cosY - z0 * sinY;
                let z1 = x0 * sinY + z0 * cosY;
                let y1 = y0;

                // Rotar X
                let y2 = y1 * cosX - z1 * sinX;
                let z2 = y1 * sinX + z1 * cosX;

                // Proyección ortográfica/perspectiva suave
                const px = cx + x1 * scale;
                const py = cy - y2 * scale;

                return { px, py, z: z2, x: x1, y: y2 };
            });

            // 2. Calcular normales y ordenar caras por profundidad (Z-buffer del pintor)
            const renderedFaces = [];

            for (let i = 0; i < modelData.faces.length; i++) {
                const face = modelData.faces[i];
                if (face.length < 3) continue;

                const v0 = transformedVerts[face[0]];
                const v1 = transformedVerts[face[1]];
                const v2 = transformedVerts[face[2]];

                if (!v0 || !v1 || !v2) continue;

                // Z promedio de la cara
                const avgZ = (v0.z + v1.z + v2.z) / 3;

                // Normal de la cara (producto cruzado)
                const ax = v1.px - v0.px, ay = v1.py - v0.py;
                const bx = v2.px - v0.px, by = v2.py - v0.py;
                const normalZ = ax * by - ay * bx;

                // Culling suave de caras traseras
                if (normalZ <= 0) continue;

                // Iluminación simulada desde luz superior-derecha (0.6, 0.8, 1.0)
                const lightIntensity = Math.min(1.0, Math.max(0.3, (normalZ / 1200)));

                renderedFaces.push({
                    avgZ,
                    v0, v1, v2,
                    light: lightIntensity
                });
            }

            // Ordenar caras de atrás hacia adelante
            renderedFaces.sort((a, b) => a.avgZ - b.avgZ);

            // 3. Dibujar polígonos rellenos con sombras rosa neón metálico Polígono Giants
            for (let i = 0; i < renderedFaces.length; i++) {
                const f = renderedFaces[i];

                const r = Math.floor(255 * f.light);
                const g = Math.floor(42 * f.light);
                const b = Math.floor(133 * Math.min(1.2, f.light + 0.3));

                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.strokeStyle = `rgba(255, 42, 133, 0.4)`;
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(f.v0.px, f.v0.py);
                ctx.lineTo(f.v1.px, f.v1.py);
                ctx.lineTo(f.v2.px, f.v2.py);
                ctx.closePath();

                ctx.fill();
                ctx.stroke();
            }
        };

        renderFrame();

        this.activeAnimators.set(containerEl, { animId, canvas });
    },

    destroy(containerEl) {
        if (this.activeAnimators.has(containerEl)) {
            const { animId } = this.activeAnimators.get(containerEl);
            cancelAnimationFrame(animId);
            containerEl.innerHTML = '';
            this.activeAnimators.delete(containerEl);
        }
    }
};
