import { TreeNode } from "./treeNode.js";
import { IDService } from "./idService.js";

export class TreeService {
    static findNodeByID(rootNode, ID) {
        if(rootNode.ID === ID) {
            return rootNode;
        } else {
            rootNode.children.forEach((child) => {
                const node = findByID(child, ID);

                if(node.ID === ID) {
                    return node;
                }
            });
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