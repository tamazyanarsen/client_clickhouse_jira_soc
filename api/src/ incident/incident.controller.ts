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
        const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 1000 })).issues;
        return {
            critical: issues.filter(e => e.fields.priority.name === 'High').length,
            normal: issues.filter(e => e.fields.priority.name === 'Low').length,
            warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
        };
        // return this.incidentService.getIncidentsByType();
    }

    @Get('total')
    async getIncidentsTotal(): Promise<any> {
        const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 1000 })).issues;
        const date = new Date();
        date.setDate(date.getDate() - 2); // за последние 2 дня
        return {
            perDay: issues.filter(e => new Date(e.fields.created) >= date).length,
            inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,
            done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
        };
        // return this.incidentService.getIncidentsTotalInfo();
    }

    @Get('traffic')
    async getTraffic(): Promise<any> {
        const ch = new this.incidentService.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });
        const data = await ch.querying('SELECT count() FROM Etanol_PROD.DataFlow_v2');
        // console.log(data);

        // const stream = ch.query('SELECT * FROM Etanol_PROD.DataFlow_v2', { format: 'JSONEachRow' });
        // stream.on('metadata', (columns) => { /* do something with column list */
        // });
        // const rows = [];
        // stream.on('data', (row) => rows.push(row));
        // stream.on('end', () => {
        //     console.log(
        //         rows.length,
        //         stream.supplemental.rows,
        //         stream.supplemental.rows_before_limit_at_least, // how many rows in result are set without windowing
        //     );
        // });

        return data.rows;
    }
}
