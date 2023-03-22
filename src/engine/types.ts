import { Size } from 'game-components/math';
import { Scene } from 'game-components/scene';

export type DirectorEventType = {
    PAUSE: {};
    RESUME: {};
    RUN_SCENE: Scene;
    RESIZE: Size;
};

export type EngineSettings = {
    fitWidth: boolean;
    fitHeight: boolean;
    designResolution: {
        width: number;
        height: number;
    };
};
