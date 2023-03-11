import { DrawInfoType } from 'core/constants';

export type WebGLEvents = 'UPDATE' | 'LOAD';

export type DOMEvents = 'CLEANUP';

export type BaseObject = {
    nodeId: number;
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number };
    type: keyof typeof DrawInfoType;
};

export type TextureObject = BaseObject & {
    textureInfo: {
        width: number;
        height: number;
        texture?: WebGLTexture | null;
    };
};

export type TextObject = BaseObject & {
    text: string;
    style?: CSSStyleDeclaration;
};
