import WebGL from 'core/webgl';
import { Director } from './director';
import '../static/css/element-style.css';
import InternalUpdate from './internal-update';
import { EngineSettings } from './types';
import Logger from 'utils/logger';

class Engine {
    private webgl;
    private canvas;
    private overlay;
    settings: EngineSettings;
    constructor(parent?: HTMLElement | null, settings?: EngineSettings) {
        Logger.logDev('Init engine. Thanks for using titan2d!');
        this.canvas = document.createElement('canvas');
        this.overlay = document.createElement('div');
        if (parent) {
            parent.appendChild(this.canvas);
            parent.appendChild(this.overlay);
        }
        this.settings = Object.assign(
            {
                fitHeight: false,
                fitWidth: true,
                designResolution: {
                    width: 960,
                    height: 640,
                },
            },
            settings || {}
        );

        Director.getInstance().engineSettings = this.settings;
        Logger.logDev('First init engine settings', this.settings);
        Director.getInstance().addListener('PAUSE', this.pause.bind(this));
        Director.getInstance().addListener('RESUME', this.resume.bind(this));
        Director.getInstance().canvasElement = this.canvas;
        this.webgl = new WebGL(this.canvas, this.overlay);
        this.webgl.addListener('UPDATE', this.update.bind(this));
        this.webgl.addListener('RESIZE', this.resize.bind(this));
        this.webgl.start();
    }

    private pause() {
        this.webgl.pause();
    }

    private resume() {
        this.webgl.resume();
    }

    private resize(width: number, height: number) {
        Director.getInstance().resize(width, height);
    }

    update(dt: number) {
        const scene = Director.getInstance().getRunningScene();
        if (scene) {
            InternalUpdate.getInstance().update(dt);
            scene.update(dt);
        }
    }

    async loadImages(urls: string[], onPercentage?: (per: number) => void) {
        for (let i = 0; i < urls.length; i++) {
            await this.webgl.loadImageAndCreateTextureInfo(urls[i]);
            onPercentage?.((i + 1) / urls.length);
        }
    }
}

export default Engine;
