/*
    This classes purpose is to provide a named space for operations on the    |
    tree of tasks. It should remain stateless.
*/

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
            let index = rootNode.parent.children.indexOf(rootNode);

            rootNode.parent.children.splice(index, 1);
            return true;
        }

        for(const child of rootNode.children) {
            const deleted = this.removeNodeByID(child, ID);

            if(deleted) {
                return deleted;
            }
        }
        return false;   
    }

    static removeNodeByNodeReference(node) {
        let index = node.parent.children.indexOf(node);

        node.parent.children.splice(index, 1);
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