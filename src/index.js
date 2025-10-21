import "./styles.css";
import { Task } from "./task.js";
import { IDService } from "./idService.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { DOM } from "./dom.js";

import { format } from 'date-fns';

console.log("Hello World");

console.log(format(new Date(), "yyyy-MM-dd' at 'HH:mm:ss.SSS"));

/*
    Test out Task functionality
*/
let task = new Task("Get Milk", "Go to Walmart and grab some milk.");
console.log(task.title);

task.complete();
console.log("This task was completed on " + task.getCompletionDate());

task.unComplete();
console.log("This task was completed on " + task.getCompletionDate());


/*
    Test out IDService
*/

console.log(IDService.getNewTaskID() );
console.log(IDService.getNewTaskID("10"));

let layeredID = IDService.getNewTaskID("10-30-10");

console.log(IDService.getIDLayer(1, layeredID) ); //Should be 30

console.log(IDService.getNewProjectID());
console.log(IDService.getNewProjectID());
console.log(IDService.getNewProjectID());
console.log(IDService.getNewProjectID());
console.log(IDService.getNewProjectID()); //should be 1, 2, 3, 4, 5

console.log(IDService.extractUniqueID(layeredID)); //should be 3

/*
    Test out TreeNode
*/

let rootNode = new TreeNode(new Task("Root Node", "root"));
let child1 = new TreeNode(new Task("Child1", "child"));
let child2 = new TreeNode(new Task("Child 2", "child"));
let grandchild = new TreeNode(new Task("Grandchild", "grandchild"));

child1.setRoot(rootNode);
child1.data.updateIDLayers(rootNode.data);
child2.setRoot(rootNode);
child2.data.updateIDLayers(rootNode.data);
grandchild.setRoot(child1);
grandchild.data.updateIDLayers(child1.data);

//test traverse function
rootNode.traverse((node) => {
    console.log(node.data);
});

//Print out with indent

function printTree(node, depth = 0) {
    let indent = "--".repeat(depth);

    console.log(indent + node.data.title + " - " + node.data.ID);

    for(const child of node.children) {
        printTree(child, depth + 1);
    }
}

printTree(rootNode);

/*
    Test out TreeService
*/

let node = TreeService.findNodeByID(rootNode, grandchild.data.ID);

console.log("We found " + node.data.title);


/*
    Work on Add Task button
*/

let dom = new DOM();

function handleAddTaskButton(event) {
    let toDoItems = document.querySelector(".to-do-items__wrapper");
    let newTask = document.createElement("div");
    newTask.classList.add("to-do__item");
    newTask.innerText = "New item";

    toDoItems.appendChild(newTask);
}

function handleNewToDoInput(event) {
    let toDoItem = event.target.parentNode;

    toDoItem.innerText = event.target.value;

    event.target.remove();
}



let addTaskButton = dom.addTaskButton;

addTaskButton.addEventListener("click", handleAddTaskButton);

let input = document.querySelector(".new-to-do-input");

input.addEventListener("change", handleNewToDoInput);