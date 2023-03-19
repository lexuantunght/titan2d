import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    await game.preloadImages(['/res/parallax-space-stars.png', '/res/bird-fly-0.png']);
    Director.getInstance().runScene(new ExampleScene());
})();
