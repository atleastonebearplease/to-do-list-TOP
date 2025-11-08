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
}
