import { Director } from 'engine/director';
import { Size } from '../math';
import { Component } from '../functional/component';
import { UITransform } from '../functional/ui-transform';
export class UIWidget extends Component {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    constructor() {
        super();
    }

    set widget(widget: { top?: number; left?: number; bottom?: number; right?: number }) {
        const { top, left, bottom, right } = widget;
        this.top = top;
        this.left = left;
        this.bottom = bottom;
        this.right = right;
        this.applyResize(Director.getInstance().viewSize);
    }

    private applyResize(size: Size) {
        if (this.node) {
            let width = size.width;
            let height = size.height;
            const parent = this.node.getParent();
            if (parent && parent.getType() === 'NODE') {
                const parentSize = parent.getComponent(UITransform).contentSize;
                width = parentSize.width;
                height = parentSize.height;
            }
            if (this.top) {
                height -= this.top;
            }
            if (this.left) {
                width -= this.left;
            }
            if (this.bottom) {
                height -= this.bottom;
            }
            if (this.right) {
                width -= this.right;
            }
            this.node.getComponent(UITransform).contentSize = new Size(width, height);
        }
    }

    cleanup() {}
}
