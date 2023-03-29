import { Director, Game } from '../index';
import ExampleScene from './scene';

(async () => {
    const game = new Game(document.getElementById('root'));
    Director.getInstance().engineSettings.fitHeight = true;
    Director.getInstance().engineSettings.fitWidth = false;
    await game.preloadImages([
        'res/parallax-space-background.png',
        'res/parallax-space-stars.png',
        'res/parallax-space-big-planet.png',
        'res/bird-fly.png',
    ]);
    Director.getInstance().runScene(new ExampleScene());
})();
