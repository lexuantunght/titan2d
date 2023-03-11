import { Size, Vec3 } from 'game-components/math';
import { Component } from './component';

export class UITransform extends Component {
    private size: Size;
    private scale: Vec3;
    private rotation: Vec3;
    constructor() {
        super();
        this.size = new Size();
        this.scale = new Vec3(1, 1, 1);
        this.rotation = new Vec3(0, 0, 0);
    }

    get contentSize() {
        return this.size;
    }

    set contentSize(size) {
        this.size = size;
    }

    getScale() {
        return this.scale;
    }

    setScale(scale: Vec3) {
        this.scale = scale;
    }

    getRotation() {
        return this.rotation;
    }

    setRotation(rotation: Vec3) {
        this.rotation = rotation;
    }
}
