import WebGL from 'core/webgl';
import { Director } from './director';
import './element-style.css';
import InternalUpdate from './internal-update';

class Engine {
    private webgl;
    private canvas;
    private overlay;
    constructor(parent?: HTMLElement | null) {
        this.canvas = document.createElement('canvas');
        this.overlay = document.createElement('div');
        if (parent) {
            parent.appendChild(this.canvas);
            parent.appendChild(this.overlay);
        }
        Director.getInstance().addListener('PAUSE', this.pause.bind(this));
        Director.getInstance().addListener('RESUME', this.resume.bind(this));
        this.webgl = new WebGL(this.canvas, this.overlay);
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
            InternalUpdate.getInstance().update(dt);
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
