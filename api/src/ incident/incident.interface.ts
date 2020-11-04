import {IncidentsState} from './state';

export type VariationType = 'critical' | 'normal' | 'warning';
export type VariationStatus = 'unresolved' | 'resolved';

export interface IncidentDTO{
    type: VariationType;
    timeStamp: Date;
    status: VariationStatus;
}

function randomValueBetween(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
}
export function generateIncidents(incidentState: IncidentsState, num: number = 1000): IncidentDTO[]{
    const incidents: IncidentDTO[] = incidentState.incidents;
    const types: string[] = ['critical', 'normal', 'warning'];
    const statuses: string[] = ['unresolved', 'resolved'];
    const someDay = 72 * 3600 * 1000;
    for (let i: number = 0; i < num; i++){
        incidents.push({
            type: types[randomValueBetween(0, types.length - 1)],
            timeStamp: new Date(
                randomValueBetween(
                    new Date().getTime() - someDay,
                    new Date().getTime(),
                ),
            ),
            status: statuses[randomValueBetween(0, statuses.length - 1)],
        } as IncidentDTO);
    }
    return incidents;
}
