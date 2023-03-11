import { Component } from './component';

export class Animation extends Component {
    playOnLoad: boolean;
    private spriteSheetUrl?: string;
    totalFrame: number;
    delay: number;
    wrapMode: 'normal' | 'loop';
    constructor() {
        super();
        this.playOnLoad = false;
        this.totalFrame = 0;
        this.delay = 0.25;
        this.wrapMode = 'normal';
    }

    set spriteSheet(url: string) {
        this.spriteSheetUrl = url;
    }

    play() {}
}
