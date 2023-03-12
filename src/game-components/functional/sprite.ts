import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Component } from './component';
import { DrawObjectManager } from 'core/draw-object-manager';

export class Sprite extends Component {
    protected texture?: TextureObject['textureInfo'];
    protected spriteFrame?: string;
    constructor() {
        super();
    }

    setSpriteFrame(url: string) {
        const texture = TextureCache.getInstance().getTexture(url);
        this.texture = texture;
        this.spriteFrame = url;
    }

    getTexture() {
        return this.texture;
    }
}
