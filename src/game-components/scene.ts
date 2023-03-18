import { Director } from 'engine/director';
import { Camera } from './functional';
import { Node } from './node';
import { Rect } from './math';

export class Scene extends Node {
    protected carmera: Camera;
    constructor() {
        super();
        this.type = 'SCENE';
        this.carmera = new Camera();
        this.carmera.setBound(
            new Rect(
                0,
                0,
                Director.getInstance().viewSize.width,
                Director.getInstance().viewSize.height
            )
        );
    }

    getCamera() {
        return this.carmera;
    }
}
