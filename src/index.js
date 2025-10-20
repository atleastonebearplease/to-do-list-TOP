import "./styles.css";
import { Task } from "./task.js";
import { IDService } from "./idService.js";
import { TreeNode } from "./treeNode.js";

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

let rootNode = new TreeNode("Root node");
let child1 = new TreeNode("Child 1");
let child2 = new TreeNode("Child 2");
let grandchild = new TreeNode("Grandchild 1");

child1.setRoot(rootNode);
child2.setRoot(rootNode);
grandchild.setRoot(child1);