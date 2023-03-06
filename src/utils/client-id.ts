class ClientID {
    private static instance: ClientID | null = null;
    private currentId: number;
    private constructor() {
        this.currentId = 0;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new ClientID();
        }
        return this.instance;
    }

    next() {
        this.currentId += 1;
        return this.currentId;
    }

    current() {
        return this.currentId;
    }
}

export default ClientID;
