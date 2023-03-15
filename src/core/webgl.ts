// @ts-nocheck
import EventModel from 'utils/event-model';
import { WebGLEvents } from 'core/types';
import { DrawObjectManager } from 'core/draw-object-manager';
import WebElement from 'core/web-element';
import { vertexShaderSource, fragmentShaderSource } from 'core/shader-source';
import WebResourceLoader from 'core/web-resource-loader';
import { DrawInfoType } from 'core/constants';
import { m4 } from 'core/m4';
import * as WebglUtils from 'core/webgl-utils';

class WebGL extends EventModel<WebGLEvents> {
    private gl: WebGL2RenderingContext;
    private webEl: WebElement;
    private webResLoader: WebResourceLoader;
    isPaused: boolean;
    constructor(canvas: HTMLCanvasElement, overlay: HTMLDivElement) {
        super();
        this.gl = canvas.getContext('webgl2');
        this.webEl = new WebElement(overlay);
        this.webResLoader = new WebResourceLoader(this.gl);
        this.init();
        this.currentTime = 0;
        this.isPaused = false;
        // setup canvas
        this.canvasToDisplaySizeMap = new Map([[this.gl.canvas, [960, 640]]]);
        this.resizeObserver = new ResizeObserver(this._onResize.bind(this));
        this.resizeObserver.observe(this.gl.canvas, { box: 'content-box' });
        this._resizeCanvasToDisplaySize = this._resizeCanvasToDisplaySize.bind(this);
        DrawObjectManager.getInstance().addListener('CLEANUP', (nodeIds) =>
            this.webEl.cleanup(nodeIds)
        );
        DrawObjectManager.getInstance().addListener('REMOVE_ITEM', (nodeId) => {
            this.webEl.removeElement(nodeId);
        });
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
        this.textureMatrixLocation = this.gl.getUniformLocation(program, 'u_textureMatrix');

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
        return this.webResLoader.loadImageAndCreateTextureInfo(url);
    };

    pause = () => {
        this.isPaused = true;
        cancelAnimationFrame(this.render);
    };

    resume = () => {
        this.isPaused = false;
        requestAnimationFrame(this.render);
    };

    drawImage = (
        tex,
        texWidth,
        texHeight,
        dstX,
        dstY,
        dstZ,
        dstWidth,
        dstHeight,
        rdX = 0,
        rdY = 0,
        rdZ = 0,
        srcX,
        srcY,
        srcWidth,
        srcHeight
    ) => {
        if (dstX === undefined) {
            dstX = srcX;
            srcX = 0;
        }
        if (dstY === undefined) {
            dstY = srcY;
            srcY = 0;
        }
        if (srcWidth === undefined) {
            srcWidth = texWidth;
        }
        if (srcHeight === undefined) {
            srcHeight = texHeight;
        }
        if (dstWidth === undefined) {
            dstWidth = srcWidth;
            srcWidth = texWidth;
        }
        if (dstHeight === undefined) {
            dstHeight = srcHeight;
            srcHeight = texHeight;
        }
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
        matrix = m4.translate(matrix, dstX, dstY, dstZ);

        // scale our 1 unit quad
        // from 1 unit to texWidth, texHeight units
        matrix = m4.scale(matrix, dstWidth, dstHeight, 1);

        // rotate
        matrix = m4.xRotate(matrix, rdX);
        matrix = m4.yRotate(matrix, rdY);
        matrix = m4.zRotate(matrix, rdZ);

        // Set the matrix.
        gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

        let texMatrix = m4.translation(srcX / texWidth, srcY / texHeight, dstZ);
        texMatrix = m4.scale(texMatrix, srcWidth / texWidth, srcHeight / texHeight, 1);

        // Set the texture matrix.
        gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);

        // draw the quad (2 triangles, 6 vertices)
        var offset = 0;
        var count = 6;
        gl.drawArrays(this.gl.TRIANGLES, offset, count);
    };

    _onResize(entries) {
        for (const entry of entries) {
            let width;
            let height;
            let dpr = window.devicePixelRatio;
            if (entry.devicePixelContentBoxSize) {
                // NOTE: Only this path gives the correct answer
                // The other 2 paths are an imperfect fallback
                // for browsers that don't provide anyway to do this
                width = entry.devicePixelContentBoxSize[0].inlineSize;
                height = entry.devicePixelContentBoxSize[0].blockSize;
                dpr = 1; // it's already in width and height
            } else if (entry.contentBoxSize) {
                if (entry.contentBoxSize[0]) {
                    width = entry.contentBoxSize[0].inlineSize;
                    height = entry.contentBoxSize[0].blockSize;
                } else {
                    // legacy
                    width = entry.contentBoxSize.inlineSize;
                    height = entry.contentBoxSize.blockSize;
                }
            } else {
                // legacy
                width = entry.contentRect.width;
                height = entry.contentRect.height;
            }
            const displayWidth = Math.round(width * dpr);
            const displayHeight = Math.round(height * dpr);
            this.canvasToDisplaySizeMap.set(entry.target, [displayWidth, displayHeight]);
        }
    }

    _resizeCanvasToDisplaySize(canvas) {
        // Get the size the browser is displaying the canvas in device pixels.
        const [displayWidth, displayHeight] = this.canvasToDisplaySizeMap.get(canvas);

        // Check if the canvas is not the same size.
        const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }

        return needResize;
    }

    draw = (drawInfos = []) => {
        const gl = this.gl;
        this._resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        drawInfos.forEach((drawInfo) => {
            switch (drawInfo.type) {
                case DrawInfoType.TEXTURE:
                    this.drawImage(
                        drawInfo.textureInfo.texture,
                        drawInfo.textureInfo.width,
                        drawInfo.textureInfo.height,
                        drawInfo.x,
                        drawInfo.y,
                        drawInfo.z,
                        drawInfo.width,
                        drawInfo.height,
                        drawInfo.rotation.x,
                        drawInfo.rotation.y,
                        drawInfo.rotation.z,
                        drawInfo.textureInfo.srcX,
                        drawInfo.textureInfo.srcY,
                        drawInfo.textureInfo.srcWidth,
                        drawInfo.textureInfo.srcHeight
                    );
                    break;
                case DrawInfoType.TEXT:
                    this.webEl.drawText(drawInfo);
                    break;
                default:
                    break;
            }
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
