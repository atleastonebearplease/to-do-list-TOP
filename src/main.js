import { DOM } from "./dom.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { Task } from "./task.js";

export class Main {
    dom;
    root;
    
    constructor() {
        this.dom = new DOM();
        this.root = new TreeNode(new Task("ROOT"));

        this.handleAddTaskButton = this.handleAddTaskButton.bind(this);
        this.handleNewToDoInput = this.handleNewToDoInput.bind(this);
        this.handleDeleteTaskButton = this.handleDeleteTaskButton.bind(this);
    }

    initialize() {
        //maybe do global event handler here

        this.dom.addTaskButton.addEventListener("click", this.handleAddTaskButton);
        this.dom.addNewProjectSection();
        this.dom.addNewProjectSection();
    }

    handleAddTaskButton(event) {
        let toDoItems = document.querySelector(".task-items__wrapper");

        let newTask = this.dom.makeNewTaskElement();

        let taskTitleInput = this.dom.makeNewTaskInput();

        taskTitleInput.addEventListener("change", this.handleNewToDoInput);
        taskTitleInput.addEventListener("blur", this.handleNewToDoInput);

        newTask.appendChild(taskTitleInput);
        toDoItems.appendChild(newTask);

        taskTitleInput.focus();
    }

    handleNewToDoInput(event){
        if(event.type === "blur") {
            if(event.target.value === "") {
                event.target.remove(); //If input is empty, remove the new task element
            }
        }
        
        if(event.target.parentNode !== null && event.type === "change") { //If the parentNode has not already been removed
            let taskElement = event.target.parentNode; //The to do item that is the parent of the input
            let inputElement = event.target;

            taskElement.innerText = inputElement.value;

            let deleteButton = this.dom.makeNewTaskDeleteButton();
            deleteButton.addEventListener("click", this.handleDeleteTaskButton);
            taskElement.appendChild(deleteButton);

            let newTask = new Task(taskElement.innerText); 
            //TODO: Eventually this will find the TreeNode for the parent and make it root instead of just the root of the Main

            newTask.treeNode.setRoot(this.root);
            newTask.updateIDLayers(this.root.data);
            taskElement.dataset.id = newTask.ID; //Update dataset ID so that it has the full ID

            inputElement.remove();
        }
    }

    handleDeleteTaskButton(event) {
        let taskDomNode = event.target.parentNode;

        TreeService.removeNodeByID(this.root, taskDomNode.dataset.id);

        console.log(`Delete task ${taskDomNode.innerText} - ID: ${taskDomNode.dataset.id}`);

        taskDomNode.remove();
        /*
            -Remove task node from node tree
            -Remove the node from the;
        */
    }
}