import ClientID from 'utils/client-id';
import { DrawObjectManager } from 'core/draw-object-manager';
import { TextObject, TextureObject } from 'core/types';
import { Vec3 } from './math';
import { GameComponentType } from './types';
import { Animation, Component, Sprite, UIText, UITransform } from './functional';

export class Node {
    protected parent: Node | null;
    protected childs: Map<number, Node>;
    protected id: number;
    protected name?: string;
    protected type: GameComponentType;
    protected position: Vec3;
    protected components: Map<new () => any, any>;
    protected anchorPoint: [number, number];
    constructor(name?: string) {
        this.id = ClientID.getInstance().next();
        this.parent = null;
        this.childs = new Map();
        this.name = name;
        this.type = 'NODE';
        this.position = new Vec3();
        this.components = new Map();
        this.anchorPoint = [0.5, 0.5];
    }

    addChild(node: Node) {
        this.childs.set(node.getID(), node);
        if (node.getParent()?.getID() !== this.getID()) {
            node.setParent(this);
        }
        if (node.getType() === 'NODE') {
            DrawObjectManager.getInstance().addItem(node);
        }
    }

    setParent(node: Node | null) {
        if (!node) {
            this.parent = null;
            return;
        }
        if (!node.getChildById(this.getID())) {
            node.addChild(this);
        }
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
        if (this.childs.size === 0) {
            return;
        }
        this.childs.forEach((child) => {
            child.setParent(null);
            DrawObjectManager.getInstance().removeItem(child.getID());
            return child.removeAllChilds();
        });
    }

    removeChild(id: number) {
        const child = this.childs.get(id);
        if (!child) {
            return;
        }
        child.setParent(null);
        child.removeAllChilds();
        DrawObjectManager.getInstance().removeItem(id);
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

    addComponent<T extends Component>(ComponentType: new () => T): T {
        const component = new ComponentType();
        this.components.set(ComponentType, component);
        return component;
    }

    getComponent<T extends Component>(ComponentType: new () => T): T {
        return this.components.get(ComponentType);
    }

    removeComponent<T extends Component>(ComponentType: new () => T) {
        this.components.delete(ComponentType);
    }

    getAnchorPoint() {
        return this.anchorPoint;
    }

    setAnchorPoint(x: number, y: number) {
        this.anchorPoint = [x, y];
    }

    getTexture(): TextureObject | undefined {
        let animOrSprite: Sprite = this.getComponent(Animation);
        if (!animOrSprite) {
            animOrSprite = this.getComponent(Sprite);
        }
        const tranform = this.getComponent(UITransform);
        if (!animOrSprite || !tranform) {
            return undefined;
        }
        return {
            nodeId: this.id,
            type: 'TEXTURE',
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            rotation: tranform.getRotation(),
            textureInfo: {
                width: tranform.contentSize.width * tranform.getScale().x,
                height: tranform.contentSize.width * tranform.getScale().y,
                texture: animOrSprite.getTexture()?.texture,
            },
        };
    }

    getTextObject(): TextObject | undefined {
        const uiText = this.getComponent(UIText);
        const tranform = this.getComponent(UITransform);
        if (!uiText || !tranform) {
            return undefined;
        }
        return {
            nodeId: this.id,
            type: 'TEXT',
            x: this.position.x,
            y: this.position.y,
            z: this.position.z,
            rotation: tranform.getRotation(),
            text: uiText.text,
            // @ts-ignore
            style: {
                fontSize: uiText.fontSize.toString(),
                fontFamily: uiText.fontFamily,
                fontWeight: uiText.fontWeight.toString(),
                color: uiText.color.toHex(),
            },
        };
    }

    onEnter() {}

    update(dt: number) {}

    onExit() {}
}
