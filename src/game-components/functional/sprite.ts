import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Component } from './component';
import { Rect } from 'game-components/math';

export class Sprite extends Component {
    protected texture?: TextureObject['textureInfo'];
    protected spriteFrame?: string;
    protected sourceRect?: Rect;
    constructor() {
        super();
    }

    setSpriteFrame(url: string) {
        const texture = TextureCache.getInstance().getTexture(url);
        this.texture = texture;
        this.spriteFrame = url;
    }

    getTexture() {
        if (this.sourceRect) {
            return {
                ...this.texture,
                srcX: this.sourceRect.x,
                srcY: this.sourceRect.y,
                srcWidth: this.sourceRect.width,
                srcHeight: this.sourceRect.height,
            };
        }
        return this.texture;
    }
}
