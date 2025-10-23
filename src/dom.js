export class DOM {
    addTaskButton;
    toDoItems;

    constructor() {
        this.addTaskButton = document.querySelector(".add-task-button");
        this.toDoItems = document.querySelector(".task-sections-wrapper");
    }

    get addTaskButton() {
        return this.addTaskButton;
    }

    addNewProjectSection() {
        let newToDoSection = document.createElement("div");

        newToDoSection.classList.add("task_section");

        this.toDoItems.appendChild(newToDoSection);
    }

    makeNewTaskElement() {
        let newTask = document.createElement("div");
        newTask.classList.add("task");

        return newTask;
    }

    makeNewTaskInput() {
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("new-task-input");

        return newInput;
    }
}

/*
    For now, we are just going to be hard coding the things that I want to use for a single section. Later
    I am going to make it such that it dynamically makes new Heading sections with new Add task buttons and all.
    These are going to be requested by the controller, accesed by functions located in the DOM (i.e. DOM.newHeading,
    DOM.newHeadingSection, etc. The DOM is part of the view and should be used to re-render and such)
*/