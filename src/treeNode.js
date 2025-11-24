export class TreeNode {
    parent;
    children = [];
    data;

    constructor(data) {
        this.data = data;
    }

    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }

    addNextSibling(node) {
        if(this.parent) {
            let index = this.parent.children.indexOf(this);

            //If we this node is at the end of the array, just push it
            if(index === this.parent.children.length - 1) {
                this.parent.children.push(node);
                node.parent = this.parent;
            } else {
                this.parent.children.splice(index + 1, 0, node);
                node.parent = this.parent;
            }
        }
    }

    traverse(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback) );
    }

    previousSibling() {
        let index = this.parent.children.indexOf(this);

        if(index > 0) {
            return this.parent.children[index - 1];
        } else {
            return undefined;
        }
    }

    nextSibling() {
        let index = this.parent.children.indexOf(this);

        if(index < this.parent.children.length - 1) {
            return this.parent.children[index + 1];
        } else {
            return undefined;
        }
    }

    remove() {
        let index = this.parent.children.indexOf(this);

        this.parent.children.splice(index, 1);
    }
}
