/*
    Part of Controller
*/

/* eslint-disable no-unused-vars */
import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { IDService } from "./idService.js";

export class TaskEventService {
    static handleKeys(event, rootNode) {
        if(event.key === "Tab") {
            event.preventDefault();

            let childTaskElement = event.target.parentNode;

            let childNode = TreeService.findNodeByID(rootNode, childTaskElement.dataset.id);

            let parentNode = childNode.previousSibling();

            //Find the node that is above this node in the order of the children
            //If there are no nodes above this node, that means 
            //that it is the only node under the parent, do nothing
            
            if(parentNode){
                TreeService.removeNodeByNodeReference(childNode); //Make sure there aren't two references in tree

                parentNode.addChild(childNode);
                childNode.data.updateIDLayers(parentNode.data);
                childTaskElement.dataset.id = childNode.data.ID;
                return true;
            }
        }

        //Get the task element to be inside of the one above it
    }

    static handleClicks(event, rootNode) {
        if(event.target.classList.contains("delete-task-button")) {
            let taskDomNode = event.target.closest(".task");

            let nextElementToFocusID = this.#findNextElementToFocusAfterDeletion(rootNode, taskDomNode.dataset.id);

            TreeService.removeNodeByID(rootNode, taskDomNode.dataset.id);

            console.log(`Delete task ${taskDomNode.innerText} - ID: ${taskDomNode.dataset.id}`);

            taskDomNode.remove();


            return {
                domChanged: true, 
                elementID: nextElementToFocusID,
            }
        }

        return {
            domChanged: false,
            elementID: undefined,
        }
    }

    static #findNextElementToFocusAfterDeletion(rootNode, elementIDToDelete) {

        let nodeToDelete = TreeService.findNodeByID(rootNode, elementIDToDelete);

        let nextSibling = nodeToDelete.nextSibling();
        let previousSibling = nodeToDelete.previousSibling();
        let parentElement = nodeToDelete.parent;

        //Check if it exists. Next, then previous, then parent (as long as parent is not ROOT)
        if(nextSibling) {
            return nextSibling.data.ID;
        } 
        else if(previousSibling) {
            return previousSibling.data.ID;
        } 
        else if (parentElement) {
            if(parentElement.data.title !== "ROOT") {
                return parentElement.data.ID;
            } 
            else {
                return undefined;
            }
        }

        // ☐ Put the focus on another element
        // ☐ If the element has a next sibling, use that
        // ☐ If it has a previous siblin, use that
        // ☐ If it has neither, use the parent element
        // ☐ If the parent element is ROOT, use nothing (there are no more tasks)
    }
}