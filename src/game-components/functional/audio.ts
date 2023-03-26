import { Component } from './component';

export class Audio extends Component {
    private audioEl: HTMLAudioElement;
    constructor() {
        super();
        this.audioEl = document.createElement('audio');
        this.audioEl.muted = true;
        this.audioEl.autoplay = true;
    }

    setSource(url: string) {
        this.audioEl.src = url;
        this.audioEl.load();
    }

    setSourceAndLoad(url: string) {
        return new Promise<void>((resolve, reject) => {
            this.audioEl.src = url;
            this.audioEl.load();
            this.audioEl.oncanplay = () => {
                resolve();
            };
            this.audioEl.onerror = () => reject();
        });
    }

    load() {
        return new Promise<void>((resolve, reject) => {
            this.audioEl.load();
            this.audioEl.oncanplay = () => {
                resolve();
            };
            this.audioEl.onerror = () => reject();
        });
    }

    play() {
        this.audioEl.muted = false;
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
