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
        if(event.target.parentNode) { //If the parentNode has not already been removed
            let taskElement = event.target.parentNode; //The to do item that is the parent of the input

            if(event.target.value !== "") {
                taskElement.innerText = event.target.value;

                let newTask = new Task(taskElement.innerText); 
                //TODO: Eventually this will find the TreeNode for the parent and make it root instead of just the root of the Main

                newTask.treeNode.setRoot(this.root);
                newTask.updateIDLayers(this.root.data);

                event.target.remove(); //remove the input from the to do item
            } else {
                taskElement.remove(); //If the input was empty, don't leave the new ToDo item Div empty
            }
        }
    }
}