import { IncidentDTO } from './incident.interface';
export declare class IncidentsState {
    static instance: IncidentsState;
    incidents: IncidentDTO[];
    private constructor();
    static getInstance(): IncidentsState;
}
