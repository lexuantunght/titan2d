import {
    Scene,
    Animation,
    Node,
    UITransform,
    Vec3,
    Sprite,
    Size,
    UIWidget,
    Director,
    UIText,
    Color,
    Rect,
    AudioEngine,
} from '../index';

class ExampleScene extends Scene {
    private mover?: Node;
    onEnter() {
        const node = new Node();
        node.addComponent(UITransform);
        // node.addComponent(Sprite).setSpriteFrame(
        //     'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.6435-9/89995656_2910987539127948_7321879170399600640_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=H87SMqJH3qwAX8DIjB5&_nc_ht=scontent.fsgn2-4.fna&oh=00_AfAI3m6SwDvljpLeMovsXVqIXQTEZOF7qI_2LK16GopJvA&oe=642ECC0C'
        // );
        node.addComponent(Sprite);
        const sp = node.getComponent(Sprite);
        sp.setSpriteFrame('res/parallax-space-background.png');
        node.addComponent(UIWidget).widget = { top: 0, bottom: 0 };
        this.addChild(node);

        const node2 = new Node();
        node2.addComponent(UITransform).setScale(new Vec3(3, 3));
        //node2.getComponent(UITransform).setRotation(new Vec3(0, 0, Math.PI / 8));
        node2.addComponent(Sprite).setSpriteFrame('res/parallax-space-big-planet.png');
        //node2.getComponent(Sprite).setSourceRect(new Rect(68, 0, 34, 24));
        //node2.getComponent(UIText).color = Color.fromHex('#ffffff');
        this.mover = node2;
        this.addChild(node2);

        const node3 = new Node();
        node3.addComponent(UITransform).setScale(new Vec3(5, 5));
        node3.addComponent(Sprite).setSpriteFrame('res/parallax-space-big-planet.png');
        //this.addChild(node3);
    }

    update(dt: number) {
        if (!this.mover) {
            return;
        }
        if (this.mover.getPosition().x < -Director.getInstance().viewSize.width / 2) {
            //console.log(this.mover.getPosition(), this.mover.getComponent(UITransform).contentSize);
            this.mover.setPosition(new Vec3(Director.getInstance().viewSize.width / 2));
        }
        this.mover.setPosition(new Vec3(this.mover.getPosition().x - dt * 50));
    }
}

export default ExampleScene;
