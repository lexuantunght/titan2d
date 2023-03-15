import { Scene, Animation, Node, UITransform } from '../index';

class ExampleScene extends Scene {
    onEnter() {
        const node = new Node();
        node.addComponent(UITransform);
        // node.addComponent(Sprite).setSpriteFrame(
        //     'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.6435-9/89995656_2910987539127948_7321879170399600640_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=H87SMqJH3qwAX8DIjB5&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfAI3m6SwDvljpLeMovsXVqIXQTEZOF7qI_2LK16GopJvA&oe=642ECC0C'
        // );
        node.addComponent(Animation);
        const anim = node.getComponent(Animation);
        anim.setSpriteSheet('/res/bird-fly.png', 4);
        anim.playMode = 'loop';
        anim.delay = 0.2;
        anim.play();
        this.addChild(node);
    }
}

export default ExampleScene;
