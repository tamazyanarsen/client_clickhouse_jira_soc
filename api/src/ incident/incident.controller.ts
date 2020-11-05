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
        const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, {maxResults: 2000})).issues;
        return {
            critical: issues.filter(e => e.fields.priority.name === 'High').length,
            normal: issues.filter(e => e.fields.priority.name === 'Low').length,
            warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
        };
        // return this.incidentService.getIncidentsByType();
    }

    @Get('total')
    async getIncidentsTotal(): Promise<any> {
        const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, {maxResults: 2000})).issues;
        const date = new Date();
        date.setDate(date.getDate() - 2); // за последние 2 дня
        return {
            perDay: issues.filter(e => new Date(e.fields.created) >= date).length,
            inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,
            done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
        };
        // return this.incidentService.getIncidentsTotalInfo();
    }
}
