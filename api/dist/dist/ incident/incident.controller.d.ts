import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';
export declare class IncidentController {
    private readonly incidentService;
    constructor(incidentService: IncidentService);
    getIncidents(): IncidentDTO[];
    getIncidentsByType(): Promise<any>;
    getIncidentsTotal(): Promise<any>;
    getTraffic(): Promise<any>;
}
