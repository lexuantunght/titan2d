import { Scene } from 'game-components/scene';
import { Size } from 'game-components/math';
import EventModel from 'utils/event-model-v2';
import { DirectorEventType, EngineSettings } from 'engine/types';
import { DrawObjectManager } from 'core/draw-object-manager';

export class Director extends EventModel<DirectorEventType> {
    private static instance: Director | null = null;
    private currentScene: Scene | null;
    private isRunning: boolean;
    private _canvasSize: Size;
    engineSettings!: EngineSettings;
    canvasElement!: HTMLCanvasElement;
    private constructor() {
        super();
        this.currentScene = null;
        this.isRunning = false;
        this._canvasSize = new Size();
        this.resize = this.resize.bind(this);
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Director();
        }
        return this.instance;
    }

    get canvasSize(): Size {
        return this._canvasSize;
    }

    get viewSize(): Size {
        return new Size(
            this.engineSettings.designResolution.width,
            this.engineSettings.designResolution.height
        );
    }

    set canvasSize(size: Size) {
        this._canvasSize = size;
    }

    resize(width: number, height: number) {
        const _size = new Size(width, height);
        this.canvasSize = _size;
        this.listeners.get('RESIZE')?.forEach((cb) => cb(_size));
    }

    getRunningScene() {
        return this.currentScene;
    }

    runScene(scene: Scene) {
        this.isRunning = true;
        if (this.currentScene) {
            this.currentScene.onExit();
        }
        DrawObjectManager.getInstance().cleanup();
        this.currentScene = scene;
        this.currentScene.onEnter();
        this.listeners.get('RUN_SCENE')?.forEach((cb) => cb());
    }

    pause() {
        this.isRunning = false;
        this.listeners.get('PAUSE')?.forEach((cb) => cb());
    }

    resume() {
        this.isRunning = true;
        this.listeners.get('RESUME')?.forEach((cb) => cb());
    }

    isPaused() {
        return !this.isRunning;
    }
}
