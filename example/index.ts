import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    await game.preloadImages(['/res/bird-fly.png']);
    Director.getInstance().runScene(new ExampleScene());
})();
