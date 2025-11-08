/* eslint-disable no-unused-vars */
import { DOM } from "./dom.js";
import { View } from "./view.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { Task } from "./task.js";
import { TaskEventService } from "./eventService.js";

export class Main {
    dom;
    root;
    view; 
    
    constructor() {
        this.dom = new DOM();
        this.root = new Task("ROOT").treeNode;
        this.view = new View();

        this.handleAddTaskButton = this.handleAddTaskButton.bind(this);
        this.handleNewToDoInput = this.handleNewToDoInput.bind(this);
        this.handleDeleteTaskButton = this.handleDeleteTaskButton.bind(this);
        this.handleKeyPresses = this.handleKeyPresses.bind(this);
        this.handleClicks = this.handleClicks.bind(this);

        //TODO: TESTING
        this.#makeNewTask("Get Milk");
        this.#makeNewTask("Hold the door");
        this.#makeNewTask("Get me outta here");
        this.view.render(this.root);
    }

    initialize() {
        this.dom.addTaskButton.addEventListener("click", this.handleAddTaskButton);

        document.addEventListener("keydown", this.handleKeyPresses);

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

            this.#makeNewTask(inputElement.value);

            this.view.render(this.root);

            inputElement.remove();
        }
    }

    handleDeleteTaskButton(event) {
        let taskDomNode = event.target.closest(".task");

        TreeService.removeNodeByID(this.root, taskDomNode.dataset.id);

        console.log(`Delete task ${taskDomNode.innerText} - ID: ${taskDomNode.dataset.id}`);

        taskDomNode.remove();

        this.view.render(this.root);
    }

    handleKeyPresses(event) {
        if(event.key === "Tab") {
            event.preventDefault(); //Don't want tabbing arouind the other elements in page
        }

        let focused = document.activeElement;

        if(focused)
        {
            if(focused.classList.contains("task-content") ) {
                if(TaskEventService.handleKeys(event, this.root)) {
                    let focusedID = focused.closest(".task").dataset.id;
                    this.view.render(this.root);

                    this.#focusTask(focusedID);
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
                    this.#focusTask(result.elementID);
                }
            }
        }
    }

    #makeNewTask(name) {
        let newTask = new Task(name);

        newTask.updateIDLayers(this.root.data);
        this.root.addChild(newTask.treeNode);
    }

    #focusTask(ID) {
        let newElementToFocus = this.dom.taskSectionRoot.querySelector(`[data-id="${ID}"]`);

        newElementToFocus.querySelector(".task-content").focus();
    }
}