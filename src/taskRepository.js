import { Task } from "./task.js";

export class TaskRepository {
    static saveTasks(rootNode) {
        let task = rootNode.data;

        let taskData = task.serializable.toJSON();

        if(rootNode.children) {
            taskData.children = [];

            for(const child of  rootNode.children) {
                taskData.children.push(this.#saveTasksRecursive(child));
            }
        }

        let taskDataJSON = JSON.stringify(taskData);

        localStorage.setItem("session", taskDataJSON);
    }

    //We should be passing in the root of Main for now
    static loadTasks(rootNode) {
        let objString = localStorage.getItem("session");

        let tasksObject = JSON.parse(objString);

        if(tasksObject !== null) {

            if(tasksObject.children) {
                for(const child of tasksObject.children) {
                    let newNode = this.#loadTasksRecursive(child);

                    rootNode.addChild(newNode);

                    newNode.data.updateIDLayers(rootNode.data);
                }
            }
        }
        
    }

    static #saveTasksRecursive(node) {
        let taskData = node.data.serializable.toJSON();
        
        if(node.children) {
            taskData.children = [];

            for(const child of node.children)
            {
                taskData.children.push(this.#saveTasksRecursive(child));
            }
        }

        return taskData;
    }

    static #loadTasksRecursive(taskData) {
        let newTask = new Task(taskData.title, taskData.description);

        newTask.serializable.fromJSON(taskData);

        if(taskData.children) {
            for(const child of taskData.children) {
                let newNode = this.#loadTasksRecursive(child);

                newTask.treeNode.addChild(newNode);

                newNode.data.updateIDLayers(newTask); //Update to include the parent title
            }
        }

        return newTask.treeNode;
    }
}