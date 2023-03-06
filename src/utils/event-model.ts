class EventModel<T> {
    protected listeners: Map<T, CallableFunction[]>;
    constructor() {
        this.listeners = new Map();
    }

    addListener(event: T, callback: CallableFunction) {
        let cbs = this.listeners.get(event);
        if (!cbs) {
            cbs = [callback];
        } else {
            cbs.push(callback);
        }
        this.listeners.set(event, cbs);
    }

    removeListener(event: T, callback: CallableFunction) {
        let cbs = this.listeners.get(event);
        if (!cbs) {
            return;
        }
        const idx = cbs.findIndex((cb) => cb === callback);
        cbs.splice(idx, 1);
        this.listeners.set(event, cbs);
    }
}

export default EventModel;
