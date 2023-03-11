import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Component } from './component';

export class Sprite extends Component {
    private texture?: TextureObject['textureInfo'];
    private spriteFrame?: string;
    constructor() {
        super();
    }

    setSpriteFrame(url: string) {
        this.texture = TextureCache.getInstance().getTexture(url);
        if (!this.texture) {
        }
        this.spriteFrame = url;
    }

    getTexture() {
        return this.texture;
    }
}
