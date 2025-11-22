/*
    This class handles the rendering of the app. Anything that has to do with  |
    the DOM should come through here. It will be responsible for adding new 
    inputs for classes, for creating task elements, and eventually for new 
    project sections and new projects on the sidebar. These may eventually be 
    delegated into new classes, but for now they'll be here
*/

import { DOM } from "./dom.js";

export class View {

    dom;

    constructor() {
        this.dom = new DOM();

        this.taskSectionRoot = document.querySelector(".task-sections-wrapper");
        this.addTaskButton = document.querySelector(".add-task-button");
        this.rootTaskList = document.querySelector(".task-list:first-of-type");
    }

    render(root) {
        this.#clearTasks();

        let parentElement = this.dom.createTaskList();
        this.rootTaskList = parentElement; //Reset the reference to the root task list

        for(const child of root.children) {
            this.#renderRecursive(child, parentElement);
        }

        let rootElement = document.querySelector(".task-sections-wrapper");

        rootElement.appendChild(parentElement);
    }

    focusTask(taskID) {
        if(taskID) {
            let newElementToFocus = this.taskSectionRoot.querySelector(`[data-id="${taskID}"]`);

            newElementToFocus.querySelector(".task-content").focus();
        }
    }

    checkOffTask(taskElement) {
        let taskText = taskElement.querySelector(".task-text");

        taskText.classList.add("task-complete");
    }

    uncheckTask(taskElement) {
        let taskText = taskElement.querySelector(".task-text");

        taskText.classList.remove("task-complete");
    }

    insertBlankInputAtEnd(inputHandler) {
        let newInput = this.dom.makeNewTaskInput();

        newInput.addEventListener("blur", inputHandler);
        newInput.addEventListener("change", inputHandler);

        this.rootTaskList.appendChild(newInput);

        newInput.focus();
    }

    insertBlankInputAfter(taskElement, inputHandler) {
        let newInput = this.dom.makeNewTaskInput();

        newInput.addEventListener("blur", inputHandler);
        newInput.addEventListener("change", inputHandler);

        taskElement.after(newInput);

        newInput.focus();
    }

    getNewSiblingTaskID(inputElement) {
        let previousTask = inputElement.previousSibling;

        if(previousTask) {
            return previousTask.dataset.id;
        } else {
            return undefined;
        }
    }

    #renderRecursive(node, parentElement) {
        let newTask = this.dom.makeNewTaskElement(node);

        parentElement.appendChild(newTask);

        if(node.children.length > 0) {
            let newTaskList = this.dom.createTaskList();

            for(const child of node.children) {
                newTask.appendChild(newTaskList);

                this.#renderRecursive(child, newTaskList);
            }
        }
    }
    
    #clearTasks() {
        this.taskSectionRoot.innerHTML = "";
    }
}