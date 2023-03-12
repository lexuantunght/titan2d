import { DOMEvents, TextObject, TextureObject } from 'core/types';
import { Node } from 'game-components';
import EventModel from 'utils/event-model';

export class DrawObjectManager extends EventModel<DOMEvents> {
    private static instance: DrawObjectManager | null = null;
    private nodes: Map<number, Node>;
    private constructor() {
        super();
        this.nodes = new Map();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DrawObjectManager();
        }
        return this.instance;
    }

    getDrawInfo() {
        const items: Array<TextureObject | TextObject> = [];
        this.nodes.forEach((node) => {
            const textObj = node.getTextObject();
            if (textObj) {
                items.push(textObj);
                return;
            }
            const texture = node.getTexture();
            if (texture) {
                items.push(texture);
            }
        });
        return items;
    }

    addItem(item: Node) {
        this.nodes.set(item.getID(), item);
    }

    cleanup() {
        this.listeners.get('CLEANUP')?.forEach((cb) => cb(Array.from(this.nodes.keys())));
        this.nodes.clear();
    }

    removeItem(nodeId: number) {
        this.listeners.get('REMOVE_ITEM')?.forEach((cb) => cb(nodeId));
        this.nodes.delete(nodeId);
    }
}
