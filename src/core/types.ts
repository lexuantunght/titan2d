export type WebGLEvents = 'UPDATE' | 'LOAD';

export type TextureObject = {
    x: number;
    y: number;
    textureInfo: { width: number; height: number; texture?: WebGLTexture | null };
};
