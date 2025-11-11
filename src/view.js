import { DOM } from "./dom.js";

export class View {

    dom;

    constructor() {
        this.dom = new DOM();
    }

    #clearTasks() {
        this.dom.taskSectionRoot.innerHTML = "";
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
}