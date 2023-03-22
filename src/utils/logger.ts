class Logger {
    static logDev(...args: any[]) {
        if (process.env.NODE_ENV === 'development') {
            console.log(...args);
        }
    }

    static log(...args: any[]) {
        console.log(...args);
    }
}

export default Logger;
