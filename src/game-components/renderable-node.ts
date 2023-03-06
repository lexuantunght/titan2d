import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Node } from './node';

export class RenderableNode extends Node {
    private texture?: TextureObject;
    constructor(url: string) {
        super();
        this.texture = TextureCache.getInstance().getTexture(url);
        this.type = 'RENDERABLE_NODE';
    }

    getTexture() {
        return this.texture;
    }
}
