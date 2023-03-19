import { Director } from 'engine/director';
import { Camera, UITransform } from './functional';
import { Node } from './node';
import { Rect, Size } from './math';
import { UIWidget } from './layout';

export class Scene extends Node {
    protected carmera: Camera;
    constructor() {
        super();
        this.type = 'SCENE';
        this.carmera = new Camera();
        const viewSize = Director.getInstance().viewSize;
        this.carmera.setBound(new Rect(0, 0, viewSize.width, viewSize.height));
        this.addComponent(UITransform).contentSize = viewSize;
        this.addComponent(UIWidget).widget = { left: 0, top: 0, right: 0, bottom: 0 };
    }

    getCamera() {
        return this.carmera;
    }
}
