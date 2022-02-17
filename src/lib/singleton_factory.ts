import { BehaviorSubject } from "rxjs";

export class SingletonFactory {

    private static instance:SingletonFactory

    constructor() {
        if (SingletonFactory.instance) {
            return SingletonFactory.instance
        }
        SingletonFactory.instance = this
    }

    instance() {
        return SingletonFactory.instance
    }
}