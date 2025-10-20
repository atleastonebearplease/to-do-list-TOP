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