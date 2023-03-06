import ClientID from 'utils/client-id';
import { DrawObjectManager } from 'core/draw-object-manager';
import { Vec3 } from './math';
import { GameComponentType } from './types';

export class Node {
    protected parent: Node | null;
    protected childs: Map<number, Node>;
    protected id: number;
    protected name?: string;
    protected type: GameComponentType;
    protected position: Vec3;
    constructor(name?: string) {
        this.id = ClientID.getInstance().next();
        this.parent = null;
        this.childs = new Map();
        this.name = name;
        this.type = 'NODE';
        this.position = new Vec3();
    }

    addChild(node: Node) {
        this.childs.set(node.getID(), node);
        node.setParent(this);
        if (node.getType() === 'RENDERABLE_NODE') {
            // @ts-ignore
            DrawObjectManager.getInstance().addTexture(node.getTexture());
        }
    }

    setParent(node: Node | null) {
        if (!node) {
            this.parent = null;
            return;
        }
        node.addChild(this);
        this.parent = node;
    }

    getParent() {
        return this.parent;
    }

    getAllChilds() {
        if (this.childs.size === 0) {
            return [];
        }
        return Array.from(this.childs.values());
    }

    removeAllChilds() {
        this.childs.forEach((child) => {
            child.setParent(null);
        });
    }

    removeChild(id: number) {
        this.childs.get(id)?.setParent(null);
        this.childs.delete(id);
    }

    getID() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getChildById(id: number) {
        return this.childs.get(id);
    }

    getChildByName(name: string) {
        return Array.from(this.childs.values()).find((child) => child.getName() === name);
    }

    getType() {
        return this.type;
    }

    getPosition() {
        return this.position;
    }

    setPosition(pos: Vec3) {
        this.position = pos;
    }

    onEnter() {}

    update(dt: number) {}

    onExit() {}
}
