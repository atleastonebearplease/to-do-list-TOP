/* eslint-disable no-unused-vars */
import { DOM } from "./dom.js";
import { View } from "./view.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { Task } from "./task.js";
import { TaskEventService } from "./eventService.js";
import { TaskRepository } from "./taskRepository.js";
import { TaskCommands } from "./taskCommands.js";

export class Main {
    dom;
    root;
    view; 
    
    constructor() {
        this.dom = new DOM();
        this.root = new Task("ROOT").treeNode;
        this.view = new View();
        this.taskCommands = new TaskCommands(this.root);

        this.handleAddTaskButton = this.handleAddTaskButton.bind(this);
        this.handleNewToDoInput = this.handleNewToDoInput.bind(this);
        this.handleKeyPresses = this.handleKeyPresses.bind(this);
        this.handleClicks = this.handleClicks.bind(this);

        // this.#makeNewTask("Get Milk");
        // this.#makeNewTask("Hold the door");
        // this.#makeNewTask("Run forest run");
        // this.#makeNewTask("Get stuff done");
        // this.#makeNewTask("To do this later");
        // this.#makeNewTask("Dont to do it yet");
        // this.#makeNewTask("Use to do if you want to live");

        TaskRepository.loadTasks(this.root);

        this.view.render(this.root);
    }

    initialize() {
        this.dom.addTaskButton.addEventListener("click", this.handleAddTaskButton);

        document.addEventListener("keydown", (event) => {
            if(event.key === "Tab") {
                event.preventDefault();
            }
        });

        document.addEventListener("keyup", this.handleKeyPresses);

        document.addEventListener("click", this.handleClicks);
    }

    handleAddTaskButton(event) {
        //Will eventually use event to get the parent of the AddTaskButton to add to different sections
        //TODO Use event to add tasks to the correct section
        let toDoItems = document.querySelector(".task-sections-wrapper > .task-list");

        let taskTitleInput = this.dom.makeNewTaskInput();

        taskTitleInput.addEventListener("change", this.handleNewToDoInput);
        taskTitleInput.addEventListener("blur", this.handleNewToDoInput);

        toDoItems.appendChild(taskTitleInput);

        taskTitleInput.focus();
    }

    handleNewToDoInput(inputEvent){
        if(inputEvent.type === "blur") {
            if(inputEvent.target.value === "") {
                inputEvent.target.remove(); //If input is empty, remove the new task element
            }
        }
        
        if(inputEvent.target.parentNode !== null && inputEvent.type === "change") { //If the parentNode has not already been removed
            let inputElement = inputEvent.target;

            let newTaskID = this.#makeNewTask(inputElement.value);

            this.view.render(this.root);

            inputElement.remove();

            this.view.focusTask(newTaskID);

            TaskRepository.saveTasks(this.root);
        }
    }
    
    handleKeyPresses(event) {
        if(event.key === "Tab") {
            event.preventDefault(); //Don't want tabbing arouind the other elements in page
        }

        let focused = document.activeElement;

        if(focused)
        {
            if(focused.classList.contains("task-content") ) {
                
                if(event.key === "Tab" && !event.shiftKey) {                    
                    let result = this.taskCommands.indentIn(this.#getTaskIDFromEvent(event));

                    if(result.domChanged) {
                        this.view.render(this.root);

                        this.view.focusTask(result.taskID);
                    }
                } 
                else if(event.key === "Tab") { //shift is pressed
                    let result = this.taskCommands.indentOut(this.#getTaskIDFromEvent(event));

                    if(result.domChanged) {
                        this.view.render(this.root);

                        this.view.focusTask(result.taskID);
                    }
                }
            }
        }
    }

    handleClicks(event) {
        if(event.target.closest(".task")) {
            let result = TaskEventService.handleClicks(event, this.root);

            if(result.domChanged) {
                this.view.render(this.root);

                if(result.elementID) {
                    this.view.focusTask(result.elementID);
                }

                TaskRepository.saveTasks(this.root);
            }
        }
    }

    #makeNewTask(name) {
        let newTask = new Task(name);

        newTask.updateIDLayers(this.root.data);
        this.root.addChild(newTask.treeNode);

        return newTask.ID;
    }

    #getTaskIDFromEvent(event) {
        let taskElement = event.target.closest(".task");

        if(taskElement) return taskElement.dataset.id;

        console.error("Task element not found: getTaskIDFromEvent");
    }
}