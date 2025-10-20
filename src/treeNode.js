export class TreeNode {
    parent;
    children = [];
    data;

    constructor(data) {
        this.data = data;
    }

    setRoot(node) {
        this.parent = node;
        node.addChild(this);//TODO make sure this actually is correct
    }

    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }

    traverse(callback) {
        callback(this);
        this.children.forEach(child => child.traverse(callback) );
    }
}
