/* eslint-disable no-unused-vars */
import "./styles.css";
import { Main } from "./main.js";

function printTree(node, depth = 0) {
    let indent = "--".repeat(depth);

    console.log(indent + node.data.title + " - " + node.data.ID);

    for(const child of node.children) {
        printTree(child, depth + 1);
    }
}

let main = new Main();

main.initialize();