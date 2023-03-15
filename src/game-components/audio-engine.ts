export class AudioEngine {
    private static instance: AudioEngine | null = null;
    private audioEl: HTMLAudioElement;
    private constructor() {
        this.audioEl = document.createElement('audio');
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AudioEngine();
        }
        return this.instance;
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
