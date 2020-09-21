type HandleType = ReturnType<typeof setImmediate>;

export class ManagedImmediate {
    private handle: HandleType = null;
    private callback: (...args: any) => void = null;
    private args: any[] = null;

    constructor() {
        this.onFire = this.onFire.bind(this);
    }


    //////////////////////
    // Public interface //
    //////////////////////

    public set<T extends Array<any>>(callback: (...args: T) => void, duration: number, ...args: T) {
        this.handle = setImmediate(this.onFire, duration);
        this.callback = callback;
        this.args = args;
    }

    public short() {
        const pending = this.callback !== null;

        if (pending) {
            this.onFire();
        }

        return pending;
    }

    public cancel() {
        if (this.handle !== null) {
            clearImmediate(this.handle);
        }

        this.handle = null;
        this.callback = null;
        this.args = null;
    }

    public isActive() {
        return this.handle !== null;
    }


    /////////////////////
    // Internal events //
    /////////////////////

    private onFire() {
        const callback = this.callback;
        const args = this.args;

        this.handle = null;
        this.callback = null;
        this.args = null;

        callback(...args);
    }
}
