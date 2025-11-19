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
    }
    
}