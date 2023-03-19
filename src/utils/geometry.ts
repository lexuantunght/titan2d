import { Node } from 'game-components/node';
import { Rect, Vec3 } from 'game-components/math';
import { UITransform } from 'game-components/functional/ui-transform';

export function isIntersectRect(from: Rect, target: Rect) {
    // no horizontal overlap
    if (from.x >= target.x + target.width || target.x >= from.x + from.width) return false;

    // no vertical overlap
    if (from.y >= target.y + target.height || target.y >= from.y + from.height) return false;

    return true;
}

export function localCoordinationToGlobal(position: Vec3, parentNode?: Node | null): Vec3 {
    if (!parentNode) {
        return position;
    }
    const realPos = new Vec3(position.x, position.y, position.z);
    if (parentNode.getType() === 'SCENE') {
        const parentSize = parentNode.getComponent(UITransform)?.contentSize;
        realPos.x += parentNode.getAnchorPoint()[0] * parentSize.width;
        realPos.y += parentNode.getAnchorPoint()[1] * parentSize.height;
    }
    const parentPos = localCoordinationToGlobal(parentNode.getPosition(), parentNode.getParent());
    return new Vec3(realPos.x + parentPos.x, realPos.y + parentPos.y, realPos.z + parentPos.z);
}
