type Viewport = { width: number; height: number };

/**
 * Get viewport (not document, and not window) dimensions
 */
export const viewport: Viewport = new (class {
    get width() {
        return document.documentElement.clientWidth;
    }
    get height() {
        return document.documentElement.clientHeight;
    }
})();
