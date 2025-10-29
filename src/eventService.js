import { TreeNode } from "./treeNode.js";
import { TreeService } from "./treeService.js";
import { IDService } from "./idService.js";

export class TaskEventService {
    static handleKeys(event, rootNode) {
        if(event.key === "Tab") {
            event.preventDefault();

            let childTaskElement = event.target;

            let childNode = TreeService.findNodeByID(rootNode, childTaskElement.dataset.id);

            let parentNode = childNode.previousSibling;

            //Find the node that is above this node in the order of the children
            //If there are no nodes above this node, that means 
            //that it is the only node under the parent, do nothing
            
            if(parentNode){
                TreeService.removeNodeByNodeReference(childNode); //Make sure there aren't two references in tree

                parentNode.addChild(childNode);
                childNode.data.updateIDLayers(parentNode.data);
                childTaskElement.dataset.id = childNode.data.ID;
            }

            function printTree(node, depth = 0) {
                let indent = " ".repeat(depth);

                console.log(indent + node.data.title + " - " + node.data.ID);

                for(const child of node.children) {
                    printTree(child, depth + 1);
                }
            }
            
            printTree(rootNode);
        }

        //Get the task element to be inside of the one above it
    }
}