import { DOMEvents, TextObject, TextureObject } from 'core/types';
import EventModel from 'utils/event-model';

export class DrawObjectManager extends EventModel<DOMEvents> {
    private static instance: DrawObjectManager | null = null;
    private textures: TextureObject[];
    private texts: TextObject[];
    private constructor() {
        super();
        this.textures = [];
        this.texts = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DrawObjectManager();
        }
        return this.instance;
    }

    getDrawInfo() {
        return [...this.textures, ...this.texts];
    }

    addTexture(texture?: TextureObject) {
        if (texture) {
            this.textures.push(texture);
        }
    }

    addText(text?: TextObject) {
        if (text) {
            this.texts.push(text);
        }
    }

    cleanup() {
        this.listeners.get('CLEANUP')?.forEach((cb) => cb(this.textures, this.texts));
        this.textures = [];
        this.texts = [];
    }
}
