export class AudioEngine {
    private static instance: AudioEngine | null = null;
    private audioEl: HTMLAudioElement;
    private constructor() {
        this.audioEl = document.createElement('audio');
        this.audioEl.autoplay = false;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new AudioEngine();
        }
        return this.instance;
    }

    setSource(url: string) {
        this.audioEl.src = url;
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

    mute() {
        this.audioEl.muted = true;
    }

    unmute() {
        this.audioEl.muted = false;
    }

    setVolume(value: number) {
        this.audioEl.volume = value;
    }

    getElement() {
        return this.audioEl;
    }
}
