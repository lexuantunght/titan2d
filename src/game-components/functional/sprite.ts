import { TextureObject } from 'core/types';
import TextureCache from 'core/texture-cache';
import { Component } from './component';
import { Rect, Size } from 'game-components/math';
import { UITransform } from './ui-transform';

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
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.contentSize = new Size(texture?.width, texture?.height);
        }
        this.spriteFrame = url;
    }

    setSourceRect(rect: Rect) {
        this.sourceRect = rect;
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.contentSize = new Size(
                Math.min(this.texture?.width || 0, rect.width),
                Math.min(this.texture?.height || 0, rect.height)
            );
        }
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
