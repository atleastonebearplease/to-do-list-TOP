export class DOM {

    makeNewTaskElement(taskNode) {
        let task = taskNode.data;
        
        let newTaskElement = document.createElement("li");
        newTaskElement.classList.add("task");
        newTaskElement.dataset.id = task.ID;
        newTaskElement.draggable = true;

        let taskContent = document.createElement("div");
        taskContent.classList.add("task-content");
        taskContent.tabIndex = 0;

        let dragHandle = document.createElement("div");
        dragHandle.classList.add("drag-handle");
        dragHandle.draggable = true;
        taskContent.appendChild(dragHandle);

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
        let deleteButtonIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        deleteButtonIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        deleteButtonIcon.setAttribute("viewBox", "0 0 24 24");
        deleteButtonIcon.setAttribute("fill", "currentColor");

        let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.innerText = "Delete";
        deleteButtonIcon.appendChild(title);

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        
        //Big circle icon fill
/*         path.setAttribute("d", "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M16,10V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V10H16M13.5,6L14.5,7H17V9H7V7H9.5L10.5,6H13.5Z"); */

        //Outline fill
        path.setAttribute("d", "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z");



        deleteButtonIcon.appendChild(path);

        deleteButtonIcon.classList.add("delete-task-button");
        
        return deleteButtonIcon;
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