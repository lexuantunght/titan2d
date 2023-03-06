import { DrawObjectTree } from 'core/types';

export class DrawObjectManager {
    private static instance: DrawObjectManager | null = null;
    private tree: DrawObjectTree | null;
    private constructor() {
        this.tree = null;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DrawObjectManager();
        }
        return this.instance;
    }

    getDrawInfo() {
        return [];
    }

    cleanup() {
        this.tree = null;
    }
}
