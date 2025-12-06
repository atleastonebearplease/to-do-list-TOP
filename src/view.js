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
    controller;

    constructor(main) {
        this.dom = new DOM();
        this.controller = main;

        this.taskSectionRoot = document.querySelector(".task-sections-wrapper");
        this.addTaskButton = document.querySelector(".add-task-button");
        this.rootTaskList = document.querySelector(".task-list:first-of-type");
        this.dragStart = this.dragStart.bind(this);
        this.dragEnd = this.dragEnd.bind(this);
        this.dragOver = this.dragOver.bind(this);
        this.drop = this.drop.bind(this);
        this.dragEnter = this.dragEnter.bind(this);
        this.dragLeave = this.dragLeave.bind(this);

        this.taskSectionRoot.addEventListener("dragstart", this.dragStart);
        this.taskSectionRoot.addEventListener("dragover", this.dragOver);
        this.taskSectionRoot.addEventListener("dragenter", this.dragEnter);

        document.addEventListener("dragleave", this.dragLeave);
        document.addEventListener("drop", this.drop);
        document.addEventListener("dragend", this.dragEnd);
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
        this.movePlaceholder(event);
    }

    drop(event) {
        //TODO: Update to actually change the task, and make sure that we aren't on top of the currently dragged one, more below
        //Also refer to KanBan board logic
        //Rewrite to change el to Task
        //Also check to see if it exists, if not, return
        //Also check to make sure that it is not the task we are trying to drag itself, if so, return
        
        event.preventDefault();

        let placeholder = event.target;
        let task = event.target.closest(".task");

        if(task || placeholder.classList.contains("placeholder")) {
            let placeholder = this.getPlaceholder(); //placeholder should exist

            if(!placeholder) console.error("PLACEHOLDER DID NOT EXIST FOR DROP");

            let taskAbove = placeholder.previousSibling;

            if(taskAbove) {

                //If we are dropping on the task we are trying to drag, we're in the same spot
                if(taskAbove === this.draggedTask) {
                    this.removePlaceholder();
                    this.removeDraggedTask();
                    return;
                }

                let dropID = taskAbove.dataset.id;

                this.controller.dropTask(event.dataTransfer.getData("task-id"), dropID, "below");
                this.removeDraggedTask();
                return;
            }

            let taskBelow = placeholder.nextSibling;

            if(taskBelow) {

                if(taskBelow === this.draggedTask) {
                    this.removePlaceholder();
                    this.removeDraggedTask();
                    return;
                }

                let dropID = taskBelow.dataset.id;

                this.controller.dropTask(event.dataTransfer.getData("task-id"), dropID, "above");
                this.removeDraggedTask();
                return; 
            }
        }
    }

    dragEnd(event) {
        let taskEl = this.draggedTask;
        if(taskEl) {
            let taskTitle = this.#getTaskTitle(taskEl);
            console.log("Ending drag on: " + taskTitle);
            this.removeDraggedTask();
            event.dataTransfer.clearData();
        }

        this.removePlaceholder();
    }

    dragEnter(event) {
        let taskEl = event.target.closest(".task");

        if(!taskEl) return;

        if(!taskEl.contains(event.relatedTarget)) {
            //Do stuff here
        }
    }

    dragLeave(event) {
        let el = event.target;

        if(!el.closest(".task-sections-wrapper")) {
            this.removePlaceholder();
        }

        //TODO: remove the placeholder on drag leave if we aren't in a task
    }

    movePlaceholder(event) {
        /* 
        This only fires when over a task
        We may not need to check if we are inside the placeholder
        It may be that we check if the placeholder is already above if we detected mouse above
            We didn't detect
            Remove the placeholder (while maintaining a reference) and make a new one, placing above
        Or already below if we detect mouse below
            If we don't detect, we remove the current placeholder (while maintaining a reference) and make a new one below

        We also have to check if the previous sibling/next sibling exists in the above scenarios
        */
        //We have this.draggedTask as well
        let placeholder = this.getPlaceholder();

        if(placeholder) {
            event.preventDefault(); //Allow placeholder to be droppable as well

            const rect = placeholder.getBoundingClientRect();

            if(
                rect.top <= event.clientY && 
                rect.bottom >= event.clientY
            ) {
                return;
            }
        }

        let task = event.target.closest(".task");

        if(!task) return;

        event.preventDefault(); //It is a task, so make it droppable

        let rect = task.getBoundingClientRect();
        if(rect.bottom - (rect.height / 2) >= event.clientY) {
            //The cursor is above
            if(!placeholder) {
                placeholder = this.makePlaceholder(this.draggedTask);

                let taskParent = task.parentElement;
                taskParent.insertBefore(placeholder, task);
            } else {
                placeholder.remove();

                let taskParent = task.parentElement;
                taskParent.insertBefore(placeholder, task);
            }

            return;
        } 

        if(rect.bottom - (rect.height / 2) <= event.clientY) {
            //the cursor is below
            if(!placeholder) {
                placeholder = this.makePlaceholder(this.draggedTask);

                task.after(placeholder);
            } else {
                placeholder.remove();

                task.after(placeholder);
            }

        }   
    }

    setDraggedTask(taskElement) {
        this.draggedTask = taskElement;
        
        if(!taskElement) console.error("view.setDraggedTask called with undefined task");
    }

    removeDraggedTask() {
        this.draggedTask = undefined;
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

    makePlaceholder(draggedTask) {
        let placeholder = document.createElement("div");
        placeholder.classList.add("placeholder");

        let rect = draggedTask.getBoundingClientRect();

        placeholder.style.height = `${rect.height}px`;

        return placeholder;
    }

    getPlaceholder() {
        return document.querySelector(".placeholder");
    }

    removePlaceholder() {
        let placeholder = this.getPlaceholder();

        placeholder?.remove();
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