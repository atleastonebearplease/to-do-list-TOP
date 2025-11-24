/*                                                                            |
    Provides domain-level operations on task objects. Public functions should
    be domain level and non-domain helper functions should be private.
*/

import { TreeService } from "./treeService.js";

export class TaskCommands {
    constructor(rootNode) {
        this.root = rootNode;
    }

    indentIn(taskID) {
        let childNode = TreeService.findNodeByID(this.root, taskID);

        let parentNode = childNode.previousSibling();

        if(parentNode) {
            childNode.remove(); //Cut it from it's current spot

            parentNode.addChild(childNode);
            childNode.data.updateIDLayers(parentNode.data);

            return {
                domChanged: true,
                taskID: childNode.data.ID
            }
        }

        return {
            domChanged: false,
            taskID: undefined,
        }
    }

    indentOut(taskID) {
        let childNode = TreeService.findNodeByID(this.root, taskID);

        //Because we can only add children, the child's original parent 
        //will now be a sibling, it's grandparent now it's parent
        let parentNode = childNode.parent.parent;

        if(parentNode) {
            childNode.remove();

            childNode.parent.addNextSibling(childNode);
            childNode.data.updateIDLayers(parentNode.data);

            return {
                domChanged: true, 
                taskID: childNode.data.ID,
            }
        }

        return {
            domChanged: false,
            taskID: undefined,
        }
    }

    deleteTask(taskID) {
        let nodeToDelete = TreeService.findNodeByID(this.root, taskID);

        if(nodeToDelete) {
            let nextFocusID = this.#calculateNextFocusAfterDelete(nodeToDelete);

            nodeToDelete.remove();
            
            return {
                domChanged: true,
                taskID: nextFocusID
            }
        } else {
            console.error("Asked to delete non-existent task");

            return {
                domChanged: false,
                taskID: undefined
            }
        }
    }

    clickCheckBox(taskID) {
        let nodeToCheck = TreeService.findNodeByID(this.root, taskID);

        let task = nodeToCheck.data;

        if(task.isComplete() ) {
            task.unComplete();

            return {
                domChanged: true,
                taskID: task.ID,
                boxChecked: false
            }
        } else {
            task.complete();

            return {
                domChanged: true,
                taskID: task.ID,
                boxChecked: true
            }
        }
    }

    insertTaskAfter(taskID, task) {
        let siblingNode = TreeService.findNodeByID(this.root, taskID);

        siblingNode.addNextSibling(task.treeNode);

        task.updateIDLayers(siblingNode.parent.data);
    }

    insertTaskAtRoot(task) {
        this.root.addChild(task.treeNode);

        task.updateIDLayers(this.root.data);
    }

    #calculateNextFocusAfterDelete(nodeToDelete) {
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