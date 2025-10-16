import "./styles.css";
import { Task } from "./task.js";

import { format } from 'date-fns';

console.log("Hello World");

console.log(format(new Date(), "yyyy-MM-dd' at 'HH:mm:ss.SSS"));

let task = new Task("Get Milk", "Go to Walmart and grab some milk.");

console.log(task.title);

task.complete();

console.log("This task was completed on " + task.getCompletionDate());

task.unComplete();

console.log("This task was completed on " + task.getCompletionDate());