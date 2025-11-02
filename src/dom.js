export class DOM {
    addTaskButton;
    toDoItems;
    taskSectionRoot;

    constructor() {
        this.addTaskButton = document.querySelector(".add-task-button");
        this.toDoItems = document.querySelector(".task-sections-wrapper");
        this.taskSectionRoot = document.querySelector(".task-sections-wrapper");
    }

    addNewProjectSection() {
        let newToDoSection = document.createElement("ul");

        newToDoSection.classList.add("task-list");

        this.toDoItems.appendChild(newToDoSection);
    }

    makeNewTaskElement(title = "", id = "") {
        let newTask = document.createElement("li");
        newTask.classList.add("task");
        newTask.dataset.id = id;

        let taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        taskContent.tabIndex = 0;

        let taskIndent = document.createElement("span");
        taskIndent.style = "width:16px";
        
        let taskTitleSpan = document.createElement("span");
        taskTitleSpan.classList.add("task-text");
        taskTitleSpan.innerText = title;

        taskContent.appendChild(taskIndent);
        taskContent.appendChild(taskTitleSpan);

        taskContent.appendChild(this.makeNewTaskDeleteButton());

        newTask.appendChild(taskContent);

        //newTask.tabIndex = 0; //Make focusable;

        return newTask;
    }

    makeNewTaskInput() {
        let newInput = document.createElement("input");
        newInput.type = "text";
        newInput.classList.add("new-task-input");

        return newInput;
    }

    makeNewTaskDeleteButton() { 
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-task-button");
        deleteButton.innerText = "Delete";
        deleteButton.tabIndex = -1;
        
        return deleteButton;
    }

    createTaskList() {
        let taskList = document.createElement("ul");
        taskList.classList.add("task-list");
        return taskList;
    }
}

/*
    For now, we are just going to be hard coding the things that I want to use for a single section. Later
    I am going to make it such that it dynamically makes new Heading sections with new Add task buttons and all.
    These are going to be requested by the controller, accesed by functions located in the DOM (i.e. DOM.newHeading,
    DOM.newHeadingSection, etc. The DOM is part of the view and should be used to re-render and such)
*/