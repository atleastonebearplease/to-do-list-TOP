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
    draggedTask; 

    constructor() {
        this.dom = new DOM();

        this.taskSectionRoot = document.querySelector(".task-sections-wrapper");
        this.addTaskButton = document.querySelector(".add-task-button");
        this.rootTaskList = document.querySelector(".task-list:first-of-type");
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.drop = this.drop.bind(this);

        this.taskSectionRoot.addEventListener("dragstart", this.dragStart);
        this.taskSectionRoot.addEventListener("dragover", this.dragOver);
        this.taskSectionRoot.addEventListener("drop", this.drop);
        this.taskSectionRoot.addEventListener("dragend", this.dragEnd);

        /*
        //TODO: Add dragEnter and dragLeave for visuals 
        this.taskSectionRoot.addEventListener("dragenter", this.dragEnter);
        this.taskSectionRoot.addEventListneer("dragleave", this.dragLeave):
         */

    }

    dragStart(event) {
        let el = event.target;
        let taskElement = el.closest(".task");

        if(!taskElement) return;
        
        event.dataTransfer.clearData();

        event.dataTransfer.effectAllowed = "move";

        this.setDraggedTask(taskElement);
        event.dataTransfer.setData("task-id", event.target.dataset.id);
        event.dataTransfer.setDragImage(taskElement, -7, -7);

        //TODO: Create a clone and leave the original in place with reduced opacity; later
        //if we drop a task, we just re-render; if we fail to drop (dragend), then we remove the opacity

        let taskText = this.#getTaskTitle(taskElement);
        console.log(`We started dragging task: ${taskText}`);
    }

    dragOver(event) {
        let el = event.target;

        //If it's a task element or a child element of a task
        if(el.classList.contains(".task") || el.closest(".task") ) {
            event.preventDefault(); //Make it droppable
            console.log("I'm being dragged over: " + this.#getTaskTitle(el.closest(".task")));
        }
    }

    drop(event) {
        //Rewrite to change el to Task
        //Also check to see if it exists, if not, return
        //Also check to make sure that it is not the task we are trying to drag itself, if so, return
        
        event.preventDefault();

        let el = event.target;

        if(el.closest(".task")) {
            console.log("I'm being dropped on: " + this.#getTaskTitle(el.closest(".task")));
        }
    }

    dragEnd(event) {
        let taskEl = this.getDraggedTask();

        if(!taskEl) return;

        let taskTitle = this.#getTaskTitle(taskEl);
        
        console.log("Ending drag on: " + taskTitle);

        this.removeDraggedTask();
        event.dataTransfer.clearData();
    }

    setDraggedTask(taskElement) {
        this.draggedTask = taskElement;

        taskElement.addEventListener("dragend", this.dragEnd);
        
        if(!taskElement) console.error("view.setDraggedTask called with undefined task");
    }

    removeDraggedTask() {
        this.draggedTask = undefined;
    }

    getDraggedTask() {
        return this.draggedTask;
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

    #getTaskTitle(taskElement) {
        return taskElement.querySelector(".task-text").innerText;
    }
    
}