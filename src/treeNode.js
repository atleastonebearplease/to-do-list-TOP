export class TreeNode {
    parent;
    children = [];
    data;
    id = 0;

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
}