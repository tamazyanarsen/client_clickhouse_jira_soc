import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';
import { JwtService } from '@nestjs/jwt';
export declare class IncidentController {
    private readonly incidentService;
    private readonly jwtService;
    constructor(incidentService: IncidentService, jwtService: JwtService);
    getIncidents(accessToken: string): IncidentDTO[] | {
        status: number;
    };
    getIncidentsByType(accessToken: string): Promise<any | {
        status: number;
    }>;
    getIncidentsTotal(accessToken: string): Promise<any | {
        status: number;
    }>;
    getTraffic(accessToken: string): Promise<any>;
}
