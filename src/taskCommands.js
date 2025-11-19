import { TreeService } from "./treeService.js";

export class TaskCommands {
    constructor(rootNode) {
        this.root = rootNode;
    }

    indentIn(taskID) {
        let childNode = TreeService.findNodeByID(this.root, taskID);

        let parentNode = childNode.previousSibling();

        if(parentNode) {
            TreeService.removeNodeByNodeReference(childNode); //Cut it from it's current spot

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
            TreeService.removeNodeByNodeReference(childNode);

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

}