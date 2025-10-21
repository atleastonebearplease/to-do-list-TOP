export class DOM {
    addTaskButton;

    constructor() {
        this.addTaskButton = document.querySelector(".add-task-button");
    }

    get addTaskButton() {
        return this.addTaskButton;
    }
}

/*
    For now, we are just going to be hard coding the things that I want to use for a single section. Later
    I am going to make it such that it dynamically makes new Heading sections with new Add task buttons and all.
    These are going to be requested by the controller, accesed by functions located in the DOM (i.e. DOM.newHeading,
    DOM.newHeadingSection, etc. The DOM is part of the view and should be used to re-render and such)
*/