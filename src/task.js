import { format } from "date-fns"
import { IDService } from "./idService.js";

export class Task {
    title;
    description;
    completed;
    dueDate = 0;
    dueDateString = "";
    #completionDate = 0;
    #completionDateString = "";
    ID = "";
    
    constructor(title, description = "") {
        this.title = title;
        this.description = description;
        this.completed = false;
        this.ID = IDService.getNewTaskID();
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
        this.#completionDate = Date.now();
        this.#completionDateString = format(Date.now(), "yyyy-MM-dd' at 'HH:mm:ss");
    }

    unComplete() {
        this.completed = false;
        this.#completionDate = 0;
        this.#completionDateString = "";
    }

    getCompletionDate() {
        return this.#completionDateString ? this.#completionDateString : "NEVER";
    }

    updateIDLayers(parentTask) {
        this.ID = IDService.updateLayeredID(this.ID, parentTask.ID);
    }
}