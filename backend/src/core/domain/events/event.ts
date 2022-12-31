export abstract class DomainEvent {
    constructor(private _time = new Date()) {}

    get time() {
        return this._time
    }

    eventName = this.constructor.name
}
