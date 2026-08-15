/* ==========================================
   FC HUB - SINCRONIZACIÓN DIRECTA EN TIEMPO REAL CON GITHUB API
   ========================================== */

const REPO_OWNER = 'Hugoum25';
const REPO_NAME = 'poligono-giants-fc';
const BRANCH = 'main';

export const GitHubSyncService = {
    getToken() {
        return localStorage.getItem('fc_hub_github_token') || '';
    },

    setToken(token) {
        if (token) {
            localStorage.setItem('fc_hub_github_token', token.trim());
        } else {
            localStorage.removeItem('fc_hub_github_token');
        }
    },

    hasToken() {
        return !!this.getToken();
    },

    /**
     * Convierte un string UTF-8 a Base64 compatible con emojis y caracteres especiales
     */
    toBase64Unicode(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        }));
    },

    /**
     * Modifica y realiza un commit automático de un archivo JSON en GitHub vía API
     */
    async syncJsonFile(filePathInRepo, dataObject, commitMessage = 'Actualización automática desde la web Admin') {
        const token = this.getToken();
        if (!token) {
            console.log('[GitHubSync] Sin token de administración configurado. Se guarda únicamente en local.');
            return false;
        }

        try {
            const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePathInRepo}`;
            const headers = {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            };

            // 1. Obtener la SHA actual del archivo en GitHub
            let sha = '';
            const getRes = await fetch(apiUrl + `?ref=${BRANCH}`, { headers });
            if (getRes.ok) {
                const fileData = await getRes.json();
                sha = fileData.sha;
            }

            // 2. Preparar contenido JSON formateado en base64
            const jsonString = JSON.stringify(dataObject, null, 2);
            const contentBase64 = this.toBase64Unicode(jsonString);

            // 3. Realizar el commit vía PUT en la API de GitHub
            const bodyPayload = {
                message: commitMessage,
                content: contentBase64,
                branch: BRANCH
            };
            if (sha) bodyPayload.sha = sha;

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers,
                body: JSON.stringify(bodyPayload)
            });

            if (putRes.ok) {
                console.log(`[GitHubSync] ✅ Archivo ${filePathInRepo} actualizado en GitHub con éxito. Vercel desplegará los cambios.`);
                return true;
            } else {
                const errData = await putRes.json();
                console.error('[GitHubSync] Error al hacer commit en GitHub:', errData);
                return false;
            }
        } catch (e) {
            console.error('[GitHubSync] Excepción al sincronizar con GitHub:', e);
            return false;
        }
    }
};
