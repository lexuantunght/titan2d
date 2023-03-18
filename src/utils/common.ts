export function deepEqual(a: any, b: any): boolean {
    if (typeof a === 'object' && typeof b === 'object') {
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        return Object.keys(a).every((key) => deepEqual(a[key], b[key]));
    }
    return a === b;
}
