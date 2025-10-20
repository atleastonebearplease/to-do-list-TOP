/*
    This module allows use to use a hierarchical ID. In other words, a task ID contains the ID of
    all of its ancestors. Say you have parent1.ID = 10 and child1 ID = 20; The ID would be 10-20.
    Simple enough.
*/

export class IDService {
    static currentTaskID = 0;
    static currentProjectID = 0;

    static getNewTaskID(parentID = "") {
        if(parentID){
            this.currentTaskID += 1;
            return parentID + "-" + this.currentTaskID;
        } else {
            this.currentTaskID += 1;
            return (this.currentTaskID).toString();
        }
    }

    static getNewProjectID() {
        this.currentProjectID += 1;
        return this.currentProjectID;
    }

    static getIDLayer(layer, ID) {
        let idLayers = this.#splitIDLayers(ID);

        if(layer >= idLayers.length){
            throw new Error("ID does not have layer " + layer);
        } else {
            return idLayers[layer];
        }
    }

    static extractUniqueID(ID) {
        let layers = this.#splitIDLayers(ID);

        return layers[layers.length - 1];
    }

    static #splitIDLayers(ID) {
        return ID.split("-");
    }

    static updateLayeredID(taskID, parentID) {
        return parentID + "-" + IDService.extractUniqueID(taskID);
        //This takes the full parent ID and then adds whatever the actual
        //current task ID is to the end. The last ID in the sequence is the unique
        //task's ID
    }
}