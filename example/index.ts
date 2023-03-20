import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    await game.preloadImages(['/res/parallax-space-background.png']);
    Director.getInstance().runScene(new ExampleScene());
})();
