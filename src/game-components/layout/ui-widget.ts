import { Director } from 'engine/director';
import { Size, Vec3 } from '../math';
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
        this.applyResize();
    }

    private applyResize() {
        if (this.node) {
            const oldSize = this.node.getComponent(UITransform).contentSize;
            const oldPosition = this.node.getPosition();
            const anchor = this.node.getAnchorPoint();

            let parentSize = Director.getInstance().engineSettings.designResolution;
            let parentAnchor = [0, 0];
            const parent = this.node.getParent();
            if (parent) {
                parentSize = parent.getComponent(UITransform).contentSize;
                parentAnchor = parent.getAnchorPoint();
            }
            let width = oldSize.width;
            let height = oldSize.height;
            const position = new Vec3(oldPosition.x, oldPosition.y, oldPosition.z);

            if (this.top !== undefined && this.bottom !== undefined) {
                height = parentSize.height - this.top - this.bottom;
                width = (oldSize.width / oldSize.height) * height;
            } else if (this.top !== undefined && this.bottom === undefined) {
                position.y = anchor[1] * height + this.top - parentAnchor[1] * parentSize.height;
            } else if (this.bottom !== undefined && this.top === undefined) {
                position.y =
                    parentSize.height -
                    (anchor[1] * height + this.bottom - parentAnchor[1] * parentSize.height);
            }

            if (this.left !== undefined && this.right !== undefined) {
                width = parentSize.width - this.left - this.right;
                height = (oldSize.height / oldSize.width) * width;
            } else if (this.left !== undefined && this.right === undefined) {
                position.x = anchor[0] * width + this.left - parentAnchor[0] * parentSize.width;
            } else if (this.right !== undefined && this.left === undefined) {
                position.x =
                    parentSize.width -
                    (anchor[0] * width + this.right - parentAnchor[0] * parentSize.width);
            }
            this.node.setPosition(position);
            this.node.getComponent(UITransform).contentSize = new Size(width, height);
        }
    }

    cleanup() {}
}
