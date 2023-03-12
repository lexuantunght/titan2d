import { TextObject } from 'core/types';

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
        textEl.style.left = textObj.x.toString();
        textEl.style.top = textObj.y.toString();
        if (textObj.style) {
            textEl.style.fontSize = textObj.style.fontSize;
            textEl.style.fontWeight = textObj.style.fontWeight;
            textEl.style.color = textObj.style.color;
            textEl.style.fontFamily = textObj.style.fontFamily;
        }
        this.elemMapping.set(textObj.nodeId, textEl);
        if (!isExistedEl) {
            this.root.appendChild(textEl);
        }
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
