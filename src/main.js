/* eslint-disable no-unused-vars */
import { DOM } from "./dom.js";
import { View } from "./view.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { Task } from "./task.js";
import { TaskRepository } from "./taskRepository.js";
import { TaskCommands } from "./taskCommands.js";
import { IDService } from "./idService.js";

export class Main {
    dom;
    root;
    view; 
    
    constructor() {
        this.dom = new DOM();
        this.root = new Task("ROOT").treeNode;
        this.view = new View(this);
        this.taskCommands = new TaskCommands(this.root);

        this.handleAddTaskButton = this.handleAddTaskButton.bind(this);
        this.handleNewToDoInput = this.handleNewToDoInput.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.#loadAll();

        this.view.render(this.root);
    }

    initialize() {
        this.view.addTaskButton.addEventListener("click", this.handleAddTaskButton);

        document.addEventListener("keydown", this.handleKeyDown);
        document.addEventListener("keyup", this.handleKeyUp);
        document.addEventListener("mousedown", this.handleMouseDown);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    handleAddTaskButton(event) {
        this.view.insertBlankInputAtEnd(this.handleNewToDoInput);
    }

    handleNewToDoInput(inputEvent){
        if(inputEvent.target.value === "") {
            inputEvent.target.remove(); //If input is empty, remove the new task element
            return;
        }
        
        let inputElement = inputEvent.target;

        inputElement.removeEventListener("blur", this.handleNewToDoInput);
        inputElement.removeEventListener("change", this.handleNewToDoInput);

        let newTask = new Task(inputElement.value);

        let siblingTaskID = this.view.getNewSiblingTaskID(inputElement);

        if(siblingTaskID) {
            this.taskCommands.insertTaskAfter(siblingTaskID, newTask);

            this.view.render(this.root);
            this.view.focusTask(newTask.ID);

            this.#saveAll();
        } else /* We are in the root list */ {
            this.taskCommands.insertTaskAtRoot(newTask);

            this.view.render(this.root);
            this.view.focusTask(newTask.ID);

            this.#saveAll();
        }
    }
    
    handleKeyUp(event) {
        if(event.key === "Tab") {
            event.preventDefault(); //Don't want tabbing arouind the other elements in page
        }

        let focused = document.activeElement;

        if(focused.classList.contains("task-content") && focused) {
            
            if(event.key === "Tab" && !event.shiftKey) {                    
                let result = this.taskCommands.indentIn(this.#getTaskIDFromEvent(event));

                if(result.domChanged) {
                    this.view.render(this.root);

                    this.view.focusTask(result.taskID);

                    this.#saveAll();
                }
            } 
            else if(event.key === "Tab") { //shift is pressed
                let result = this.taskCommands.indentOut(this.#getTaskIDFromEvent(event));

                if(result.domChanged) {
                    this.view.render(this.root);

                    this.view.focusTask(result.taskID);

                    this.#saveAll();
                }
            }
            else if(event.key === "Enter") {
                let taskElement = focused.closest(".task");

                this.view.insertBlankInputAfter(taskElement, this.handleNewToDoInput);
            }
        }
    }

    handleKeyDown(event) {
        if(event.key === "Tab") {
            event.preventDefault();
        }
        
        if(event.key === "ArrowUp") {
            console.log("Arrow key up");

            this.view.focusPreviousTask();
        } else if(event.key === "ArrowDown") {
            console.log("Arrow key down");
            
            this.view.focusNextTask();
        }
    }

    handleMouseDown(event) {

    }

    handleMouseUp(event) {
        let target = event.target; 

        let taskElement = target.closest(".task");
        
        if(taskElement) {

            if(target.classList.contains("delete-task-button")) {
                let result = this.taskCommands.deleteTask(taskElement.dataset.id);

                if(result.domChanged) {
                    this.view.render(this.root);
                    this.view.focusTask(result.taskID);

                    this.#saveAll();
                }
            } else if(target.classList.contains("task-checkbox")) {
                let result = this.taskCommands.clickCheckBox(taskElement.dataset.id);

                if(result.boxChecked) {
                    this.view.checkOffTask(taskElement);
                } else {
                    this.view.uncheckTask(taskElement);
                }

                this.view.focusTask(result.taskID);

                this.#saveAll();
            }
        }
    }

    dropTask(draggedID, droppedID, dropPosition) {
        let newID = this.taskCommands.moveTask(draggedID, droppedID, dropPosition);

        if(newID) {
            this.view.render(this.root);
            this.view.focusTask(newID);

            this.#saveAll();
        } else {
            this.view.focusTask(draggedID);
        }
    }

    #getTaskIDFromEvent(event) {
        let taskElement = event.target.closest(".task");

        if(taskElement) return taskElement.dataset.id;

        console.error("Task element not found: getTaskIDFromEvent");
    }

    #saveAll() {
        TaskRepository.saveTasks(this.root);
        IDService.saveIDs();
    }

    #loadAll() {
        TaskRepository.loadTasks(this.root);
        IDService.loadIDs();
    }
}