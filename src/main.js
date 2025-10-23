import { DOM } from "./dom.js";

export class Main {
    dom;
    
    constructor() {
        this.dom = new DOM();

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

        let newTask = document.createElement("div");
        newTask.classList.add("task");

        let taskTitleInput = document.createElement("input");
        taskTitleInput.type = "text";
        taskTitleInput.classList.add("new-task-input");

        taskTitleInput.addEventListener("change", this.handleNewToDoInput);
        taskTitleInput.addEventListener("blur", this.handleNewToDoInput);

        newTask.appendChild(taskTitleInput);
        toDoItems.appendChild(newTask);

        taskTitleInput.focus();
    }

    handleNewToDoInput(event){
        if(event.target.parentNode) { //If the parentNode has not already been removed
            let toDoItem = event.target.parentNode; //The to do item is the parent of the input

            if(event.target.value !== "") {
                toDoItem.innerText = event.target.value;

                event.target.remove(); //remove the input from the to do item
            } else {
                toDoItem.remove(); //If the input was empty, don't leave the new ToDo item Div empty
            }
        }
    }
}