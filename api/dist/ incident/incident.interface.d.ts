import { IncidentsState } from './state';
export declare type VariationType = 'critical' | 'normal' | 'warning';
export declare type VariationStatus = 'unresolved' | 'resolved';
export interface IncidentDTO {
    type: VariationType;
    timeStamp: Date;
    status: VariationStatus;
}
export declare function generateIncidents(incidentState: IncidentsState, num?: number): IncidentDTO[];
