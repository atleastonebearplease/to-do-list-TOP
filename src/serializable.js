export class Serializable {
    constructor( {toJSON, fromJSON} ) {
        this._toJSON = toJSON;
        this._fromJSON = fromJSON;
    }

    toJSON() {
        return this._toJSON();
    }

    fromJSON(json) {
        return this._fromJSON(json);
    }
}