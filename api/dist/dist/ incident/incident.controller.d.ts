import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';
export declare class IncidentController {
    private readonly incidentService;
    constructor(incidentService: IncidentService);
    getIncidents(): IncidentDTO[];
    getIncidentsByType(): Promise<any>;
    getIncidentsTotal(): {
        total: number;
        perday: number;
        unresolved: number;
        resolved: number;
    };
}
