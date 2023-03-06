import { TextureObject } from 'core/types';

export class DrawObjectManager {
    private static instance: DrawObjectManager | null = null;
    private textures: TextureObject[];
    private constructor() {
        this.textures = [];
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DrawObjectManager();
        }
        return this.instance;
    }

    getDrawInfo() {
        return this.textures;
    }

    addTexture(texture?: TextureObject) {
        if (texture) {
            this.textures.push(texture);
        }
    }

    cleanup() {
        this.textures = [];
    }
}
