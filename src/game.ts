import Engine from 'engine';
import { EngineSettings } from 'engine/types';

export class Game {
    private engine;
    constructor(parent?: HTMLElement | null, engineSettings?: EngineSettings) {
        this.engine = new Engine(parent, engineSettings);
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
