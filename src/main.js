/* eslint-disable no-unused-vars */
import { DOM } from "./dom.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { Task } from "./task.js";
import { TaskEventService } from "./eventService.js";

export class Main {
    dom;
    root;
    
    constructor() {
        this.dom = new DOM();
        this.root = new Task("ROOT").treeNode;

        this.handleAddTaskButton = this.handleAddTaskButton.bind(this);
        this.handleNewToDoInput = this.handleNewToDoInput.bind(this);
        this.handleDeleteTaskButton = this.handleDeleteTaskButton.bind(this);

        //TODO: TESTING
        this.#makeNewTask("Get Milk");
        this.#makeNewTask("Hold the door");
        this.#makeNewTask("Get me outta here");
    }

    initialize() {
        this.dom.addTaskButton.addEventListener("click", this.handleAddTaskButton);

        document.addEventListener("keydown", (event) => {
            if(event.key === "Tab") {
                event.preventDefault(); //Don't want tabbing arouind the other elements in page
            }

            if(document.activeElement.classList.contains("task") ) {
                if(TaskEventService.handleKeys(event, this.root)) {
                    //View.RenderTasks(root);
                }
            }
        });
    }

    handleAddTaskButton(event) {
        //Will eventually use event to get the parent of the AddTaskButton to add to different sections
        //TODO Use event to add tasks to the correct section
        let toDoItems = document.querySelector(".task-items__wrapper");

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

            inputElement.remove();
        }
    }

    handleDeleteTaskButton(event) {
        let taskDomNode = event.target.parentNode;

        TreeService.removeNodeByID(this.root, taskDomNode.dataset.id);

        console.log(`Delete task ${taskDomNode.innerText} - ID: ${taskDomNode.dataset.id}`);

        taskDomNode.remove();
    }

    #makeNewTask(name) {
        let newTask = new Task(name);
        let newTaskNode = newTask.treeNode;
        let newTaskElement = this.dom.makeNewTaskElement();

        newTaskElement.innerText = name;

        let deleteButton = this.dom.makeNewTaskDeleteButton();
        deleteButton.addEventListener("click", this.handleDeleteTaskButton);
        newTaskElement.appendChild(deleteButton);

        //TODO: Eventually this will find the TreeNode for the parent and make it root instead of just the root of the Main

        this.root.addChild(newTaskNode);
        newTaskNode.data.updateIDLayers(this.root.data);
        newTaskElement.dataset.id = newTaskNode.data.ID;

        let taskItems = document.querySelector(".task-items__wrapper");
        taskItems.appendChild(newTaskElement);

        return newTaskNode;
    }
}