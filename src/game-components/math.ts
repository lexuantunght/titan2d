export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export function v3(x = 0, y = 0, z = 0) {
    return new Vec3(x, y, z);
}

export class Size {
    width: number;
    height: number;
    constructor(width = 100, height = 100) {
        this.width = width;
        this.height = height;
    }
}
export function size(w = 100, h = 100) {
    return new Size(w, h);
}
