import { Rect } from 'game-components/math';
import { Component } from './component';

export class Camera extends Component {
    private bound;
    constructor() {
        super();
        this.bound = new Rect();
    }

    setBound(bound: Rect) {
        this.bound = bound;
    }

    getBound() {
        return this.bound;
    }
}
