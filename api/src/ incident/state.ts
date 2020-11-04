import {generateIncidents, IncidentDTO} from './incident.interface';

export class IncidentsState {
    public static instance: IncidentsState;
    public incidents: IncidentDTO[] = [];

    private constructor() {
        this.incidents = generateIncidents(this);
    }

    public static getInstance(): IncidentsState{
        if (!this.instance) {
            this.instance = new IncidentsState();
        }
        return this.instance;
    }
}