import { Controller, Get, Headers } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';
import { validateAccessToken } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import * as ld from 'lodash';

@Controller('api/incident')
export class IncidentController {
    constructor(
        private readonly incidentService: IncidentService,
        private readonly jwtService: JwtService,
    ) {
    }

    @Get()
    getIncidents(@Headers('authorization') accessToken: string):
        IncidentDTO[] | {
        status: number,
    } {
        if (validateAccessToken(accessToken, this.jwtService)) {
            return this.incidentService.getIncidents();
        } else {
            return { status: 401 };
        }
    }

    @Get('bytype')
    async getIncidentsByType(@Headers('authorization') accessToken: string): Promise<any | {
        status: number,
    }> {
        if (validateAccessToken(accessToken, this.jwtService)) {
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;
            return {
                critical: issues.filter(e => e.fields.priority.name === 'High').length,
                normal: issues.filter(e => e.fields.priority.name === 'Low').length,
                warning: issues.filter(e => e.fields.priority.name === 'Medium').length,
            };
        } else {
            return { status: 401 };
        }
    }

    @Get('total')
    async getIncidentsTotal(@Headers('authorization') accessToken: string): Promise<any | {
        status: number,
    }> {
        if (validateAccessToken(accessToken, this.jwtService)) {
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 2000 })).issues;
            const date = new Date();
            date.setDate(date.getDate() - 2); // за последние 2 дня
            return {
                perDay: issues.filter(e => new Date(e.fields.created) >= date).length,
                inProgress: issues.filter(e => e.fields.status.name.toLowerCase() === 'investigated').length,
                done: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
            };
        } else {
            return { status: 401 };
        }
    }

    @Get('traffic')
    async getTraffic(@Headers('authorization') accessToken: string): Promise<any> {
        if (validateAccessToken(accessToken, this.jwtService)) {
            const ch = new this.incidentService.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });
            const searchDate = new Date(Date.now());
            searchDate.setMinutes(searchDate.getMinutes() - 1);
            console.log('searchDate', searchDate);
            // ORDER BY time_app_sec DESC
            const rawLimit = 5000;
            const answer = await ch.querying(
                // tslint:disable-next-line:max-line-length
                `SELECT * FROM Etanol_PROD.DataFlow_v2 WHERE time_event_sec > ${searchDate.getTime().toString().slice(0, -3)} LIMIT ${rawLimit} FORMAT JSONEachRow`);
            const data = answer.split('\n').filter(e => e.length > 0).map(e => JSON.parse(e));
            console.log(data.slice(0, 5), data.length);
            const result = data.map(e => new Date(parseInt(e.time_event_sec + '000', 10)));
            console.log('result:', result.slice(0, 2));
            return ld.groupBy(result);
            // return Object.keys(groupData).map(e => ({[e]: groupData[e].length}));
        } else {
            return { status: 401 };
        }
    }
}
