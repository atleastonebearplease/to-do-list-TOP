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
            return this.currentTaskID;
        }
    }

    static getIDLayer(layer, ID) {
        let idLayers = ID.split("-");

        if(layer >= idLayers.length){
            throw new Error("ID does not have layer " + layer);
        } else {
            return idLayers[layer];
        }
    }
}