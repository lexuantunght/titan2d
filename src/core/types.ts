export type WebGLEvents = 'UPDATE' | 'LOAD';

export type TextureObject = { width: number; height: number; texture?: WebGLTexture | null };

export type DrawObjectTree = {
    childs?: DrawObjectTree[];
    value: TextureObject;
};
