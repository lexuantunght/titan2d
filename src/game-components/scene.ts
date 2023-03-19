import { Director } from 'engine/director';
import { DrawObjectManager } from 'core/draw-object-manager';
import { Camera, UITransform } from './functional';
import { Node } from './node';
import { Rect, Size } from './math';

export class Scene extends Node {
    constructor() {
        super();
        this.type = 'SCENE';
        this.onResize = this.onResize.bind(this);
        const viewSize = Director.getInstance().viewSize;
        this.addComponent(Camera).setBound(new Rect(0, 0, viewSize.width, viewSize.height));
        this.addComponent(UITransform).contentSize = viewSize;
        DrawObjectManager.getInstance().renderBound = this.getComponent(Camera).getBound();
        Director.getInstance().addListener('RESIZE', this.onResize);
    }

    private onResize(size: Size) {
        this.getComponent(UITransform).contentSize = new Size(size.width, size.height);
        this.getComponent(Camera).setBound(new Rect(0, 0, size.width, size.height));
        DrawObjectManager.getInstance().renderBound = this.getComponent(Camera).getBound();
    }

    onExit() {
        Director.getInstance().removeListener('RESIZE', this.onResize);
    }
}
