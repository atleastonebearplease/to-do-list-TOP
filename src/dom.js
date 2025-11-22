export class DOM {

    makeNewTaskElement(taskNode) {
        let task = taskNode.data;
        
        let newTaskElement = document.createElement("li");
        newTaskElement.classList.add("task");
        newTaskElement.dataset.id = task.ID;

        let taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        taskContent.tabIndex = 0;

        let checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.classList.add("task-checkbox");
        taskContent.appendChild(checkBox);

        if(task.isComplete() ) {
            taskContent.classList.add("task-complete");
            checkBox.checked = true;
        }

        
        let taskTitleSpan = document.createElement("span");
        taskTitleSpan.classList.add("task-text");
        taskTitleSpan.innerText = task.title;
        taskContent.appendChild(taskTitleSpan);

        taskContent.appendChild(this.makeNewTaskDeleteButton());

        newTaskElement.appendChild(taskContent);

        //newTaskElement.tabIndex = 0; //Make focusable;

        return newTaskElement;
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