import TextureCache from 'core/texture-cache';

class WebResourceLoader {
    private gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
    }

    loadImageAndCreateTextureInfo = (url: string) => {
        return new Promise((resolve, reject) => {
            const textureCache = TextureCache.getInstance();
            if (textureCache.hasLoaded(url)) {
                resolve(textureCache.getTexture(url));
                return;
            }
            const gl = this.gl;
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            // Fill the texture with a 1x1 blue pixel.
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                1,
                1,
                0,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255])
            );

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            const textureInfo = {
                width: 1, // we don't know the size until it loads
                height: 1,
                texture: tex,
            };
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.addEventListener('load', () => {
                textureInfo.width = img.width;
                textureInfo.height = img.height;

                gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                textureCache.setTexture(url, textureInfo);
                resolve(textureInfo);
            });
            img.addEventListener('error', () => {
                reject(`Load assets ${url} failed`);
            });
            img.src = url;
        });
    };
}

export default WebResourceLoader;
