export class Vec3 {
    x: number;
    y: number;
    z: number;
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    isEqualTo(other: Vec3) {
        let kx: string | number = 1;
        let ky: string | number = 1;
        let kz: string | number = 1;
        if (this.x === 0) {
            if (other.x !== 0) {
                return false;
            }
            kx = 'N';
        } else {
            kx = other.x / this.x;
        }
        if (this.y === 0) {
            if (other.y !== 0) {
                return false;
            }
            ky = 'N';
        } else {
            ky = other.y / this.y;
        }
        if (this.z === 0) {
            if (other.z !== 0) {
                return false;
            }
            kz = 'N';
        } else {
            kz = other.z / this.z;
        }
        return kx === ky && ky === kz;
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

export class Rect {
    width: number;
    height: number;
    x: number;
    y: number;
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class Line {
    point: Vec3;
    direction: Vec3;
    constructor(point: Vec3, direction: Vec3) {
        this.point = point;
        this.direction = direction;
    }

    static fromPoints(p1: Vec3, p2: Vec3) {
        const dir = new Vec3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);
        return new Line(p1, dir);
    }
}
