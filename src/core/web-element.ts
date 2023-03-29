import { TextObject } from 'core/types';
import { Director } from 'engine/director';

class WebElement {
    private root: HTMLDivElement;
    private elemMapping: Map<number, HTMLElement>;
    constructor(root: HTMLDivElement) {
        this.root = root;
        this.elemMapping = new Map();
        this.cleanup = this.cleanup.bind(this);
        this.removeElement = this.removeElement.bind(this);
    }

    drawText(textObj: TextObject) {
        let textEl = this.elemMapping.get(textObj.nodeId);
        const isExistedEl = !!textEl;
        if (!textEl) {
            textEl = document.createElement('span');
            textEl.style.position = 'absolute';
        }
        textEl.textContent = textObj.text;
        const textElPos = this.canvasPosToWebPos(textObj.x, textObj.y);
        textEl.style.left = textElPos.x + 'px';
        textEl.style.top = textElPos.y + 'px';
        textEl.style.height = textObj.height + 'px';
        textEl.style.width = textObj.width + 'px';
        textEl.style.transform = `translate(${-textObj.anchor[0] * 100}%, ${
            -textObj.anchor[1] * 100
        }%)`;
        if (textObj.style) {
            textEl.style.fontSize = textObj.style.fontSize;
            textEl.style.fontWeight = textObj.style.fontWeight;
            textEl.style.color = textObj.style.color;
            textEl.style.fontFamily = textObj.style.fontFamily;
            textEl.style.display = textObj.style.display;
            textEl.style.justifyContent = textObj.style.justifyContent;
            textEl.style.alignItems = textObj.style.alignItems;
        }
        this.elemMapping.set(textObj.nodeId, textEl);
        if (!isExistedEl) {
            this.root.appendChild(textEl);
        }
    }

    private canvasPosToWebPos(x: number, y: number) {
        const canvasSize = Director.getInstance().canvasSize;
        const ratioX = canvasSize.width / this.root.clientWidth;
        const ratioY = canvasSize.height / this.root.clientHeight;
        return {
            x: x / ratioX,
            y: y / ratioY,
        };
    }

    removeElement(nodeId: number) {
        const node = this.elemMapping.get(nodeId);
        if (node) {
            this.root.removeChild(node);
        }
    }

    cleanup(nodeIds: number[]) {
        nodeIds.forEach((id) => this.removeElement(id));
    }
}

export default WebElement;
