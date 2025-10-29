import "./styles.css";
import { Task } from "./task.js";
import { IDService } from "./idService.js";
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { DOM } from "./dom.js";
import { Main } from "./main.js";

import { format } from 'date-fns';

import { TaskEventService } from "./eventService.js";

function printTree(node, depth = 0) {
    let indent = "--".repeat(depth);

    console.log(indent + node.data.title + " - " + node.data.ID);

    for(const child of node.children) {
        printTree(child, depth + 1);
    }
}

let main = new Main();

main.initialize();

