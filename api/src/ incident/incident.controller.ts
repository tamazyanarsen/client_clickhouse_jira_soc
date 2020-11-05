import { Controller, Get } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';

@Controller('api/incident')
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) {
    }

    @Get()
    getIncidents(): IncidentDTO[] {
        return this.incidentService.getIncidents();
    }

    @Get('bytype')
    async getIncidentsByType(): Promise<any> {
        const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`)).issues;
        return {
            critical: issues.filter(e => e.fields.priority.name === 'High').length,
            normal: issues.filter(e => e.fields.priority.name === 'Low').length,
            warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
        };
        // return this.incidentService.getIncidentsByType();
    }

    @Get('total')
    getIncidentsTotal(): {
        total: number,
        perday: number,
        unresolved: number,
        resolved: number,
    } {
        return this.incidentService.getIncidentsTotalInfo();
    }
}
