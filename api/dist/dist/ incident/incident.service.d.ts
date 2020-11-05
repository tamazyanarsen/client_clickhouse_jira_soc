import { IncidentDTO } from './incident.interface';
export declare class IncidentService {
    private incidentsArr;
    jira: any;
    constructor();
    getIncidents(): IncidentDTO[];
    private getCountIncidentByType;
    getIncidentsByType(): {
        critical: number;
        normal: number;
        warning: number;
    };
    private getCountIncidentPerDay;
    private getCountIncidentByStatus;
    getIncidentsTotalInfo(): {
        total: number;
        perday: number;
        unresolved: number;
        resolved: number;
    };
}
