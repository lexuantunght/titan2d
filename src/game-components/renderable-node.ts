import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Node } from './node';

export class RenderableNode extends Node {
    private texture?: TextureObject;
    constructor(url: string) {
        super();
        this.texture = {
            x: this.position.x,
            y: this.position.y,
            textureInfo: TextureCache.getInstance().getTexture(url) || { width: 0, height: 0 },
        };
        this.type = 'RENDERABLE_NODE';
    }

    getTexture() {
        return this.texture;
    }
}
