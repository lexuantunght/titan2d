import { Node } from './node';

export class Scene extends Node {
    constructor() {
        super();
        this.type = 'SCENE';
    }
}
