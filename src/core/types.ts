import { DrawInfoType } from 'core/constants';

export type WebGLEvents = 'UPDATE' | 'LOAD';

export type DOMEvents = 'CLEANUP' | 'REMOVE_ITEM';

export type BaseObject = {
    nodeId: number;
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number };
    type: keyof typeof DrawInfoType;
    anchor: [number, number];
    width: number;
    height: number;
};

export type TextureObject = BaseObject & {
    textureInfo: {
        width?: number;
        height?: number;
        texture?: WebGLTexture | null;
        srcX?: number;
        srcY?: number;
        srcWidth?: number;
        srcHeight?: number;
    };
};

export type TextObject = BaseObject & {
    text: string;
    style?: CSSStyleDeclaration;
};
