/* ==========================================================
   ESCUDO OFICIAL POLÍGONO GIANTS F7
   ========================================================== */

export const ClubLogo = {
    /**
     * @param {number} size     tamaño en px
     * @param {string} extraClass
     */
    render(size = 48, extraClass = '') {
        return `<img src="./src/assets/club/club-logo.png" alt="Escudo Polígono Giants F7" width="${size}" height="${size}" class="club-official-logo ${extraClass}" style="width:${size}px;height:${size}px" draggable="false" />`;
    }
};
