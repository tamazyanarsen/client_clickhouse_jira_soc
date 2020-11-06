"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentsState = void 0;
const incident_interface_1 = require("./incident.interface");
class IncidentsState {
    constructor() {
        this.incidents = [];
        this.incidents = incident_interface_1.generateIncidents(this);
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new IncidentsState();
        }
        return this.instance;
    }
}
exports.IncidentsState = IncidentsState;
//# sourceMappingURL=state.js.map