"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIncidents = void 0;
function randomValueBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function generateIncidents(incidentState, num = 1000) {
    const incidents = incidentState.incidents;
    const types = ['critical', 'normal', 'warning'];
    const statuses = ['unresolved', 'resolved'];
    const someDay = 72 * 3600 * 1000;
    for (let i = 0; i < num; i++) {
        incidents.push({
            type: types[randomValueBetween(0, types.length - 1)],
            timeStamp: new Date(randomValueBetween(new Date().getTime() - someDay, new Date().getTime())),
            status: statuses[randomValueBetween(0, statuses.length - 1)],
        });
    }
    return incidents;
}
exports.generateIncidents = generateIncidents;
//# sourceMappingURL=incident.interface.js.map