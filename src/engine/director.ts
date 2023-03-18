import { Scene } from 'game-components/scene';
import { Size } from 'game-components/math';
import EventModel from 'utils/event-model';
import { DirectorEventType } from 'engine/types';
import { DrawObjectManager } from 'core/draw-object-manager';

export class Director extends EventModel<DirectorEventType> {
    private static instance: Director | null = null;
    private currentScene: Scene | null;
    private isRunning: boolean;
    private _viewSize: Size;
    private constructor() {
        super();
        this.currentScene = null;
        this.isRunning = false;
        this._viewSize = new Size();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Director();
        }
        return this.instance;
    }

    get viewSize() {
        return this._viewSize;
    }

    set viewSize(size: Size) {
        this._viewSize = size;
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
        DrawObjectManager.getInstance().renderBound = scene.getCamera().getBound();
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
