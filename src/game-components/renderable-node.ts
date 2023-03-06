import { Node } from './node';

export class RenderableNode extends Node {
    constructor(name?: string) {
        super(name);
        this.type = 'RENDERABLE_NODE';
    }
}
