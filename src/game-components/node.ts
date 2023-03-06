import ClientID from 'utils/client-id';
import { GameComponentType } from './types';

export class Node {
    protected parent: Node | null;
    protected childs: Map<number, Node>;
    protected id: number;
    protected name?: string;
    protected type: GameComponentType;
    constructor(name?: string) {
        this.id = ClientID.getInstance().next();
        this.parent = null;
        this.childs = new Map();
        this.name = name;
        this.type = 'NODE';
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

    onEnter() {}

    update(dt: number) {}

    onExit() {}
}
