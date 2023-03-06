import Engine from 'engine';

export class Game {
    private engine;
    constructor(parent?: HTMLElement) {
        this.engine = new Engine(parent);
    }

    preloadImages(urls: string[]) {
        return this.engine.loadImages(urls);
    }
}
