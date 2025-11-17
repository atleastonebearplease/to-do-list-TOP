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
            if(!event.shiftKey) {

                let childTaskElement = event.target.closest(".task");

                let childNode = TreeService.findNodeByID(rootNode, childTaskElement.dataset.id);

                let parentNode = childNode.previousSibling();

                //Find the node that is above this node in the order of the children
                //If there are no nodes above this node, that means 
                //that it is the only node under the parent, do nothing
                
                if(parentNode){
                    TreeService.removeNodeByNodeReference(childNode); //Make sure there aren't two references in tree

                    parentNode.addChild(childNode);
                    childNode.data.updateIDLayers(parentNode.data);
                    childTaskElement.dataset.id = childNode.data.ID; //Must update so that we can refocus
                    return { 
                        domChanged: true,
                        elementID: childTaskElement.dataset.id,
                    }
                }
            } else {
                console.log("Shift + Tab");

                let childTaskElement = event.target.parentNode;

                let childNode = TreeService.findNodeByID(rootNode, childTaskElement.dataset.id);

                let parentNode = childNode.parent.parent;

                if(parentNode) {
                    TreeService.removeNodeByNodeReference(childNode);

                    childNode.parent.addNextSibling(childNode); //Add it as the next sibling of the original parent
                    childNode.data.updateIDLayers(parentNode.data);
                    childTaskElement.dataset.id = childNode.data.ID; //Must update so that we can refocus

                    return { 
                        domChanged: true,
                        elementID: childTaskElement.dataset.id,
                    }
                }
            }
        }

        return {
            domChanged: false,
            elementID: undefined,
        }
    }

    static handleClicks(event, rootNode) {
        if(event.target.classList.contains("delete-task-button")) {
            let taskDomNode = event.target.closest(".task");

            let nextElementToFocusID = this.#findNextElementToFocusAfterDeletion(rootNode, taskDomNode.dataset.id);

            TreeService.removeNodeByID(rootNode, taskDomNode.dataset.id);

            taskDomNode.remove();

            return {
                domChanged: true, 
                elementID: nextElementToFocusID,
            }
        }

        if(event.target.classList.contains("task-checkbox")) {
            let taskDomNode = event.target.closest(".task");
            let taskText = taskDomNode.querySelector(".task-text");

            let treeNode = TreeService.findNodeByID(rootNode, taskDomNode.dataset.id);
            if(event.target.checked) {
                treeNode.data.complete();

                taskText.classList.add("task-complete");
            } else {
                treeNode.data.unComplete();

                taskText.classList.remove("task-complete");
            }

            return {
                domChanged: true, 
                elementID: taskDomNode.dataset.id,
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
    }
}