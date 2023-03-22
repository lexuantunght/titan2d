import Engine from 'engine';

export class Game {
    private engine;
    constructor(parent?: HTMLElement | null) {
        this.engine = new Engine(parent);
    }

    /**
     *
     * @param urls list urls need load
     * @param onPercentage callback percentage (0 -> 1)
     * @returns void
     */
    preloadImages(urls: string[], onPercentage?: (per: number) => void) {
        return this.engine.loadImages(urls, onPercentage);
    }
}
