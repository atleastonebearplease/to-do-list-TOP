export class EventHandler {
    Handle(event) {
        throw new Error("This must be implemented");
    }
}

export class GlobalEventHandler {
    DOM = undefined;
    
    constructor(DOM) {
        this.DOM = DOM;
    }

    Handle(event) {
        
    }
}