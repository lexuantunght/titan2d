export type GameComponentType = 'NODE' | 'SCENE';

export type NodeEventMap = {
    KEY_DOWN: {
        key: string;
        code: number;
    };
    KEY_UP: {
        key: string;
        code: number;
    };
    MOUSE_DOWN: {
        x: number;
        y: number;
        button: 1 | 2 | 3;
    };
    MOUSE_UP: {
        x: number;
        y: number;
        button: 1 | 2 | 3;
    };
    MOUSE_WHEEL: {
        deltaX: number;
        deltaY: number;
        deltaZ: number;
        deltaMode: number;
    };
};
