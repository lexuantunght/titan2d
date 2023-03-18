import { Rect } from 'game-components/math';

export function isIntersectRect(from: Rect, target: Rect) {
    // no horizontal overlap
    if (from.x >= target.x + target.width || target.x >= from.x + from.width) return false;

    // no vertical overlap
    if (from.y >= target.y + target.height || target.y >= from.y + from.height) return false;

    return true;
}
