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

    static getIDLayersCount(ID) {
        return this.#splitIDLayers(ID).length;
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

    static saveIDs() {
        let idsObject = this.#toJSON();

        let idsString = JSON.stringify(idsObject);

        localStorage.setItem("fortira-ids", idsString);
    }

    static loadIDs() {
        let idsString = localStorage.getItem("fortira-ids");

        let idsObject = JSON.parse(idsString);

        if(idsObject) {
            this.#fromJSON(idsObject);
        }
    }

    static #toJSON() {
        return {
            currentTaskID: this.currentTaskID,
            currentProjectID: this.currentProjectID
        }
    }

    static #fromJSON(json) {
        if(json.currentTaskID) {
            this.currentTaskID = json.currentTaskID;
        } else {
            this.currentTaskID = 0;
        }

        if(json.currentProjectID) {
            this.currentProjectID = json.currentProjectID;
        } else {
            this.currentProjectID = 0;
        }
    }
}