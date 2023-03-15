import InternalUpdate from 'engine/internal-update';
import { Rect } from 'game-components/math';
import { Sprite } from './sprite';
/**
 * spriteSheet can be a single file has all frames or multi frame files
 */
export class Animation extends Sprite {
    playOnLoad: boolean;
    private spriteSheet: string | string[];
    totalFrame: number;
    currentFrame: number;
    /**
     * Delay per frame by second
     */
    delay: number;
    private timeCount: number;
    playMode: 'normal' | 'loop';
    constructor() {
        super();
        this.playOnLoad = false;
        this.totalFrame = 1;
        this.delay = 0.25;
        this.playMode = 'normal';
        this.currentFrame = 0;
        this.timeCount = 0;
        this.spriteSheet = [];
        this.updateAnimation = this.updateAnimation.bind(this);
    }

    play() {
        InternalUpdate.getInstance().addListener('UPDATE', this.updateAnimation);
    }

    stop() {
        InternalUpdate.getInstance().removeListener('UPDATE', this.updateAnimation);
    }

    setSpriteSheet(source: string | string[], totalFrame?: number) {
        if (totalFrame) {
            this.totalFrame = totalFrame;
        }
        this.spriteSheet = source;
        this.runFrame(this.currentFrame);
    }

    private runFrame(frame: number) {
        if (Array.isArray(this.spriteSheet)) {
            this.setSpriteFrame(this.spriteSheet[frame]);
        } else {
            this.setSpriteFrame(this.spriteSheet);
            if (this.texture?.width) {
                const frameWidth = this.texture.width / this.totalFrame;
                this.sourceRect = new Rect(frame * frameWidth, 0, frameWidth, this.texture.height);
            }
        }
        this.currentFrame = frame;
    }

    private updateAnimation(dt: number) {
        if (this.timeCount >= this.delay) {
            if (this.currentFrame === this.totalFrame - 1) {
                if (this.playMode !== 'loop') {
                    this.stop();
                    this.timeCount = 0;
                    this.currentFrame = 0;
                    return;
                }
                this.runFrame(0);
            } else {
                this.runFrame(this.currentFrame + 1);
            }
            this.timeCount = 0;
        } else {
            this.timeCount += dt;
        }
    }
}
