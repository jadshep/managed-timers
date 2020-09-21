type HandleType = ReturnType<typeof setInterval>;

export class ManagedInterval {
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
        this.handle = setInterval(this.onFire, duration);
        this.callback = callback;
        this.args = args;
    }

    public short(cancel: boolean = false) {
        const pending = this.callback !== null;

        if (pending) {
            this.onFire();
        }

        if (cancel) {
            this.cancel();
        }

        return pending;
    }

    public cancel() {
        if (this.handle !== null) {
            clearInterval(this.handle);
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
        this.callback(...this.args);
    }
}
