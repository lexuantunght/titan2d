import { DOMEvents, TextObject, TextureObject } from 'core/types';
import { Rect } from 'game-components/math';
import { Node } from 'game-components/node';
import EventModel from 'utils/event-model';
import * as GeometryUtils from 'utils/geometry';

export class DrawObjectManager extends EventModel<DOMEvents> {
    private static instance: DrawObjectManager | null = null;
    private nodes: Map<number, Node>;
    public renderBound: Rect;
    private constructor() {
        super();
        this.nodes = new Map();
        this.renderBound = new Rect();
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
            if (
                textObj &&
                GeometryUtils.isIntersectRect(
                    this.renderBound,
                    new Rect(textObj.x, textObj.y, textObj.width, textObj.height)
                )
            ) {
                items.push(textObj);
                return;
            }
            const texture = node.getTexture();
            if (
                texture &&
                GeometryUtils.isIntersectRect(
                    this.renderBound,
                    new Rect(texture.x, texture.y, texture.width, texture.height)
                )
            ) {
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
