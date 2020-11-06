import {Controller, Get, Headers} from '@nestjs/common';
import {IncidentService} from './incident.service';
import {IncidentDTO} from './incident.interface';
import {validateAccessToken} from '../auth/auth.service';
import {JwtService} from '@nestjs/jwt';

@Controller('api/incident')
export class IncidentController {
    constructor(
        private readonly incidentService: IncidentService,
        private readonly jwtService: JwtService,
    ) {}

    @Get()
    getIncidents(@Headers('authorization') accessToken: string):
        IncidentDTO[] | {
        status: number,
    }{
        if (validateAccessToken(accessToken, this.jwtService)){
            return this.incidentService.getIncidents();
        } else {
            return {status: 401};
        }
    }

    @Get('bytype')
    async getIncidentsByType(@Headers('authorization') accessToken: string): Promise<any | {
        status: number,
    }> {
        if (validateAccessToken(accessToken, this.jwtService)){
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, {maxResults: 2000})).issues;
            return {
                critical: issues.filter(e => e.fields.priority.name === 'High').length,
                normal: issues.filter(e => e.fields.priority.name === 'Low').length,
                warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
            };
        } else {
            return {status: 401};
        }
    }

    @Get('total')
    async getIncidentsTotal(@Headers('authorization') accessToken: string): Promise<any | {
        status: number,
    }> {
        if (validateAccessToken(accessToken, this.jwtService)){
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, {maxResults: 2000})).issues;
            const date = new Date();
            date.setDate(date.getDate() - 2); // за последние 2 дня
            return {
                perDay: issues.filter(e => new Date(e.fields.created) >= date).length,
                inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,
                done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
            };
        } else {
            return {status: 401};
        }
    }

    @Get('traffic')
    async getTraffic(@Headers('authorization') accessToken: string): Promise<any> {
        if (validateAccessToken(accessToken, this.jwtService)){
            const ch = new this.incidentService.ClickHouse({host: 'srv-ch-11.int.soc.secure-soft.tech'});
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
        } else {
            return {status: 401};
        }
    }
}
