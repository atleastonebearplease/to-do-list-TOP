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

            let parentNode = childNode.previousSibling;

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
}