import { TreeNode } from "./treeNode.js";
import { IDService } from "./idService.js";

export class TreeService {
    static findNodeByID(rootNode, ID) {
        if(rootNode.data.ID === ID) {
            return rootNode;
        }
        for(const child of rootNode.children) {
            const found = this.findNodeByID(child, ID);

            if(found) {
                return found;
            }
        }
        return undefined;
    }

    static removeNodeByID(rootNode, ID) {
        if(rootNode.data.ID === ID) {
            let index = rootNode.parent.children.indexOf(this);

            rootNode.parent.children.splice(index, 1);
        }

        for(const child of rootNode.children) {
            const deleted = this.removeNodeByID(child, ID);

            if(deleted) {
                return deleted;
            }
        }
        throw new Error("Requested to delete task that does not exist.");
    }
}


/*
rootNode
    Child1
        grandChild
    Chil2
END

rootNode === ID? No
    SEARCH CHILDREN
    child1 === ID? No
        SEARCH CHILDREN
        grandchild === ID? YES
        RETURN GRANDCHILD
    NODE.ID === ID
    RETURN NODE
NODE.ID === ID
RETURN NODE
*/