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
    }

    render(root) {
        this.#clearTasks();

        let parentElement = this.dom.createTaskList();

        for(const child of root.children) {
            this.#renderRecursive(child, parentElement);
        }

        let rootElement = document.querySelector(".task-sections-wrapper");

        rootElement.appendChild(parentElement);
    }

    focusTask(taskID) {
        if(taskID) {
            let newElementToFocus = this.dom.taskSectionRoot.querySelector(`[data-id="${taskID}"]`);

            newElementToFocus.querySelector(".task-content").focus();
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
        this.dom.taskSectionRoot.innerHTML = "";
    }
}