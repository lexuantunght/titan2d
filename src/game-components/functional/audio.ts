import { Component } from './component';

export class Audio extends Component {
    private audioEl: HTMLAudioElement;
    constructor() {
        super();
        this.audioEl = document.createElement('audio');
    }

    setSource(url: string) {
        this.audioEl.src = url;
        this.audioEl.load();
    }

    play() {
        this.audioEl.play();
    }

    set loop(isLoop: boolean) {
        this.audioEl.loop = isLoop;
    }

    pause() {
        this.audioEl.pause();
    }

    get isPaused() {
        return this.audioEl.paused;
    }
}
