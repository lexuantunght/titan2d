// @ts-nocheck
import * as WebglUtils from './webgl-utils';
import { m4 } from './m4';
import TextureCache from 'core/texture-cache';
import { WebGLEvents } from 'core/types';
import { DrawObjectManager } from 'core/draw-object-manager';
import EventModel from 'utils/event-model';

const vertexShaderSource = `#version 300 es
in vec4 a_position;
in vec2 a_texcoord;
uniform mat4 u_matrix;
out vec2 v_texcoord;
void main() {
  gl_Position = u_matrix * a_position;
  v_texcoord = a_texcoord;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
   outColor = texture(u_texture, v_texcoord);
}
`;

class WebGL extends EventModel<WebGLEvents> {
    private gl: WebGL2RenderingContext;
    isPaused: boolean;
    constructor(canvas: HTMLCanvasElement) {
        super();
        this.gl = canvas.getContext('webgl2');
        this.init();
        this.currentTime = 0;
        this.isPaused = false;
    }

    init = () => {
        // Use our boilerplate utils to compile the shaders and link into a program
        const program = WebglUtils.createProgramFromSources(this.gl, [
            vertexShaderSource,
            fragmentShaderSource,
        ]);
        this.program = program;

        // look up where the vertex data needs to go.
        const positionAttributeLocation = this.gl.getAttribLocation(program, 'a_position');
        const texcoordAttributeLocation = this.gl.getAttribLocation(program, 'a_texcoord');

        // lookup uniforms
        this.matrixLocation = this.gl.getUniformLocation(program, 'u_matrix');
        this.textureLocation = this.gl.getUniformLocation(program, 'u_texture');

        // Create a vertex array object (attribute state)
        const vao = this.gl.createVertexArray();
        this.vao = vao;

        // and make it the one we're currently working with
        this.gl.bindVertexArray(vao);

        // create the position buffer, make it the current ARRAY_BUFFER
        // and copy in the color values
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // Put a unit quad in the buffer
        const positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2; // 2 components per iteration
        var type = this.gl.FLOAT; // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0; // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset
        );

        // create the texcoord buffer, make it the current ARRAY_BUFFER
        // and copy in the texcoord values
        var texcoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        // Put texcoords in the buffer
        var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texcoords), this.gl.STATIC_DRAW);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(texcoordAttributeLocation);

        // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        var size = 2; // 3 components per iteration
        var type = this.gl.FLOAT; // the data is 32bit floats
        var normalize = true; // convert from 0-255 to 0.0-1.0
        var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next color
        var offset = 0; // start at the beginning of the buffer
        this.gl.vertexAttribPointer(
            texcoordAttributeLocation,
            size,
            type,
            normalize,
            stride,
            offset
        );
    };

    loadImageAndCreateTextureInfo = (url) => {
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

    pause = () => {
        this.isPaused = true;
        cancelAnimationFrame(this.render);
    };

    resume = () => {
        this.isPaused = false;
        requestAnimationFrame(this.render);
    };

    drawImage = (tex, texWidth, texHeight, dstX, dstY) => {
        const gl = this.gl;
        gl.useProgram(this.program);

        // Setup the attributes for the quad
        gl.bindVertexArray(this.vao);

        var textureUnit = 0;
        // the shader we're putting the texture on texture unit 0
        gl.uniform1i(this.textureLocation, textureUnit);

        // Bind the texture to texture unit 0
        gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        gl.bindTexture(this.gl.TEXTURE_2D, tex);

        // this matrix will convert from pixels to clip space
        var matrix = m4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);

        // translate our quad to dstX, dstY
        matrix = m4.translate(matrix, dstX, dstY, 0);

        // scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, texWidth, texHeight, 1);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

        // draw the quad (2 triangles, 6 vertices)
        var offset = 0;
        var count = 6;
        gl.drawArrays(this.gl.TRIANGLES, offset, count);
    };

    draw = (drawInfos = []) => {
        const gl = this.gl;
        WebglUtils.resizeCanvasToDisplaySize(gl.canvas, window.devicePixelRatio);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        drawInfos.forEach((drawInfo) => {
            this.drawImage(
                drawInfo.textureInfo.texture,
                drawInfo.textureInfo.width,
                drawInfo.textureInfo.height,
                drawInfo.x,
                drawInfo.y
            );
        });
    };

    render = (time: number) => {
        const now = time * 0.001;
        const deltaTime = Math.min(0.1, now - this.currentTime);
        this.currentTime = now;

        this.listeners.get('UPDATE')?.forEach((cb) => cb(deltaTime));
        this.draw(DrawObjectManager.getInstance().getDrawInfo());

        requestAnimationFrame(this.render);
    };

    start = () => {
        requestAnimationFrame(this.render);
    };
}

export default WebGL;
