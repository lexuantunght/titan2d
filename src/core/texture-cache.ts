import { TextureObject } from 'core/types';

class TextureCache {
    private static instance: TextureCache | null = null;
    private cache: Map<string, TextureObject>;
    private constructor() {
        this.cache = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new TextureCache();
        }
        return this.instance;
    }

    hasLoaded(url: string) {
        return this.cache.has(url);
    }

    getTexture(url: string) {
        return this.cache.get(url);
    }

    setTexture(url: string, data: TextureObject) {
        this.cache.set(url, data);
    }

    removeTexture(url: string) {
        this.cache.delete(url);
    }
}

export default TextureCache;
