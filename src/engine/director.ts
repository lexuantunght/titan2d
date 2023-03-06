import { Scene } from 'game-components';
import EventModel from 'utils/event-model';
import { DirectorEventType } from 'engine/types';
import { DrawObjectManager } from 'core/draw-object-manager';

export class Director extends EventModel<DirectorEventType> {
    private static instance: Director | null = null;
    private currentScene: Scene | null;
    private isRunning: boolean;
    private constructor() {
        super();
        this.currentScene = null;
        this.isRunning = false;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Director();
        }
        return this.instance;
    }

    getRunningScene() {
        return this.currentScene;
    }

    runScene(scene: Scene) {
        DrawObjectManager.getInstance().cleanup();
        this.isRunning = true;
        if (this.currentScene) {
            this.currentScene.onExit();
        }
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
