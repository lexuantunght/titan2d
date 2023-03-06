import WebGL from 'core/webgl';
import { Director } from './director';

class Engine {
    private webgl;
    private canvas;
    constructor(parent?: HTMLElement) {
        this.canvas = document.createElement('canvas');
        if (parent) {
            parent.appendChild(this.canvas);
        }
        Director.getInstance().addListener('PAUSE', this.pause.bind(this));
        Director.getInstance().addListener('RESUME', this.resume.bind(this));
        this.webgl = new WebGL(this.canvas);
        this.webgl.addListener('UPDATE', this.update.bind(this));
        this.webgl.start();
    }

    private pause() {
        this.webgl.pause();
    }

    private resume() {
        this.webgl.resume();
    }

    update(dt: number) {
        const scene = Director.getInstance().getRunningScene();
        if (scene) {
            scene.update(dt);
        }
    }

    async loadImages(urls: string[]) {
        for (const url of urls) {
            await this.webgl.loadImageAndCreateTextureInfo(url);
        }
    }
}

export default Engine;
