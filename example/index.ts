import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    await game.preloadImages([
        'res/parallax-space-background.png',
        'res/parallax-space-big-planet.png',
    ]);
    Director.getInstance().runScene(new ExampleScene());
})();
