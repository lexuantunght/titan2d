import EventModel from 'utils/event-model';

class InternalUpdate extends EventModel<'UPDATE'> {
    private static instance: InternalUpdate | null = null;
    private constructor() {
        super();
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new InternalUpdate();
        }
        return this.instance;
    }

    update(dt: number) {
        this.listeners.get('UPDATE')?.forEach((cb) => cb(dt));
    }
}

export default InternalUpdate;
