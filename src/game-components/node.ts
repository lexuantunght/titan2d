import ClientID from 'utils/client-id';
import { DrawObjectManager } from 'core/draw-object-manager';
import { TextObject, TextureObject } from 'core/types';
import EventModel from 'utils/event-model-v2';
import * as GeometryUtils from 'utils/geometry';
import { Vec3 } from './math';
import { GameComponentType, NodeEventMap } from './types';
import { Animation, Component, Sprite, UIText, UITransform } from './functional';

export class Node extends EventModel<NodeEventMap> {
    protected parent: Node | null;
    protected childs: Map<number, Node>;
    protected id: number;
    protected name?: string;
    protected type: GameComponentType;
    protected position: Vec3;
    protected globalPosition: Vec3;
    protected components: Map<new () => any, any>;
    protected anchorPoint: [number, number];
    constructor(name?: string) {
        super();
        this.id = ClientID.getInstance().next();
        this.parent = null;
        this.childs = new Map();
        this.name = name;
        this.type = 'NODE';
        this.position = new Vec3();
        this.globalPosition = GeometryUtils.localCoordinationToGlobal(this.position, this.parent);
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
        this.globalPosition = GeometryUtils.localCoordinationToGlobal(this.position, this.parent);
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
        this.globalPosition = GeometryUtils.localCoordinationToGlobal(this.position, this.parent);
    }

    addComponent<T extends Component>(ComponentType: new () => T): T {
        const component = new ComponentType();
        component.node = this;
        this.components.set(ComponentType, component);
        return component;
    }

    getComponent<T extends Component>(ComponentType: new () => T): T {
        return this.components.get(ComponentType);
    }

    removeComponent<T extends Component>(ComponentType: new () => T) {
        const component = this.components.get(ComponentType);
        if (component) {
            component.cleanup();
            component.node = null;
            this.components.delete(ComponentType);
        }
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
        const textureObj = animOrSprite.getTexture();
        const width = tranform.contentSize.width * tranform.getScale().x;
        const height = tranform.contentSize.height * tranform.getScale().y;
        const position = this.globalPosition;
        return {
            nodeId: this.id,
            type: 'TEXTURE',
            x: position.x,
            y: position.y,
            z: position.z,
            rotation: tranform.getRotation(),
            width,
            height,
            anchor: this.anchorPoint,
            textureInfo: {
                width: textureObj?.width,
                height: textureObj?.height,
                texture: textureObj?.texture,
                srcX: textureObj?.srcX,
                srcY: textureObj?.srcY,
                srcHeight: textureObj?.srcHeight,
                srcWidth: textureObj?.srcWidth,
            },
        };
    }

    getTextObject(): TextObject | undefined {
        const uiText = this.getComponent(UIText);
        const tranform = this.getComponent(UITransform);
        if (!uiText || !tranform) {
            return undefined;
        }
        const width = tranform.contentSize.width * tranform.getScale().x;
        const height = tranform.contentSize.height * tranform.getScale().y;
        return {
            nodeId: this.id,
            type: 'TEXT',
            x: this.globalPosition.x,
            y: this.globalPosition.y,
            z: this.globalPosition.z,
            rotation: tranform.getRotation(),
            text: uiText.text,
            anchor: this.anchorPoint,
            width,
            height,
            // @ts-ignore
            style: {
                fontSize: uiText.fontSize + 'px',
                fontFamily: uiText.fontFamily,
                fontWeight: uiText.fontWeight.toString(),
                color: uiText.color.toHex(),
                display: 'flex',
                justifyContent: uiText.textAlign,
                alignItems: uiText.verticalAlign,
            },
        };
    }

    onEnter() {}

    update(dt: number) {}

    onExit() {}
}
