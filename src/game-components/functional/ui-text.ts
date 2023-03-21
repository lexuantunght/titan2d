import { Color } from 'game-components/color';
import { Component } from './component';

export class UIText extends Component {
    text: string;
    fontSize: number;
    fontWeight: number;
    fontFamily: string;
    color: Color;
    textAlign: 'center' | 'start' | 'end' | 'justify';
    verticalAlign: 'start' | 'center' | 'end';
    constructor() {
        super();
        this.text = '';
        this.fontSize = 14;
        this.fontWeight = 400;
        this.color = new Color();
        this.fontFamily = 'system-ui, -apple-system, sans-serif';
        this.textAlign = 'start';
        this.verticalAlign = 'start';
    }
}
