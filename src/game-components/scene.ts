import { Director } from 'engine/director';
import { DrawObjectManager } from 'core/draw-object-manager';
import { Camera, UITransform } from './functional';
import { Node } from './node';
import { Rect, Size } from './math';

export class Scene extends Node {
    constructor() {
        super();
        this.type = 'SCENE';
        this.onResize = this.onResize.bind(this);
        const viewSize = Director.getInstance().viewSize;
        this.addComponent(Camera).setBound(new Rect(0, 0, viewSize.width, viewSize.height));
        this.addComponent(UITransform).contentSize =
            Director.getInstance().engineSettings.designResolution;
        DrawObjectManager.getInstance().renderBound = this.getComponent(Camera).getBound();
        Director.getInstance().addListener('RESIZE', this.onResize);
        this.setUpListeners();
    }

    private onResize(size: Size) {
        // Camera should follow by canvas size because engine check intersect camera with texture in core layer
        this.getComponent(Camera).setBound(new Rect(0, 0, size.width, size.height));
        DrawObjectManager.getInstance().renderBound = this.getComponent(Camera).getBound();
    }

    private setUpListeners() {
        Director.getInstance().canvasElement.addEventListener('keydown', this.onKeyDown);
        Director.getInstance().canvasElement.addEventListener('keyup', this.onKeyUp);
        Director.getInstance().canvasElement.addEventListener('mousedown', this.onMouseDown);
        Director.getInstance().canvasElement.addEventListener('wheel', this.onMouseWheel);
        Director.getInstance().canvasElement.addEventListener('mouseup', this.onMouseUp);
    }

    private cleanUpListeners() {
        Director.getInstance().canvasElement.removeEventListener('keydown', this.onKeyDown);
        Director.getInstance().canvasElement.removeEventListener('keyup', this.onKeyUp);
        Director.getInstance().canvasElement.removeEventListener('mousedown', this.onMouseDown);
        Director.getInstance().canvasElement.removeEventListener('wheel', this.onMouseWheel);
        Director.getInstance().canvasElement.removeEventListener('mouseup', this.onMouseUp);
    }

    private onKeyDown = (e: KeyboardEvent) => {
        this.listeners.get('KEY_DOWN')?.forEach((cb) => cb({ key: e.key, code: e.code }));
    };

    private onKeyUp = (e: KeyboardEvent) => {
        this.listeners.get('KEY_UP')?.forEach((cb) => cb({ key: e.key, code: e.code }));
    };

    private onMouseDown = (e: MouseEvent) => {
        this.listeners.get('MOUSE_DOWN')?.forEach((cb) => cb({ x: e.x, y: e.y, button: e.button }));
    };

    private onMouseUp = (e: MouseEvent) => {
        this.listeners.get('MOUSE_UP')?.forEach((cb) => cb({ x: e.x, y: e.y, button: e.button }));
    };

    private onMouseWheel = (e: WheelEvent) => {
        this.listeners
            .get('MOUSE_WHEEL')
            ?.forEach((cb) =>
                cb({ deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ, deltaMode: e.deltaMode })
            );
    };

    onExit() {
        Director.getInstance().removeListener('RESIZE', this.onResize);
        this.cleanUpListeners();
    }
}
