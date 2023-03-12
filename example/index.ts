import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    await game.preloadImages([
        '/res/bird-fly-0.png',
        '/res/bird-fly-1.png',
        '/res/bird-fly-2.png',
        '/res/bird-fly-3.png',
    ]);
    Director.getInstance().runScene(new ExampleScene());
})();
