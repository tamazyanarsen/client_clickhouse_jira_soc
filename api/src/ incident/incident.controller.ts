import { Controller, Get, Headers } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentDTO } from './incident.interface';
import { validateAccessToken } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

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
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 5000 })).issues;
            return {
                critical: issues.filter(e => e.fields.priority.name === 'Blocker'
                    && ['INVESTIGATE PROCESS', 'INVESTIGATED'].includes(e.fields.status.name.toUpperCase())).length,
                normal: issues.filter(e => e.fields.priority.name === 'High'
                    && ['INVESTIGATE PROCESS', 'INVESTIGATED'].includes(e.fields.status.name.toUpperCase())).length,
                warning: issues.filter(e => ['Medium', 'Low'].includes(e.fields.priority.name)
                    && ['INVESTIGATE PROCESS', 'INVESTIGATED'].includes(e.fields.status.name.toUpperCase())).length,
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
            const issues = (await this.incidentService.jira.searchJira(`project=DEBUG`, { maxResults: 5000 })).issues;
            const date = new Date();
            date.setDate(date.getDate() - 2); // за последние 2 дня
            return {
                perDay: issues.filter(e => new Date(e.fields.created) >= date
                    && ['INVESTIGATE PROCESS', 'INVESTIGATED'].includes(e.fields.status.name.toUpperCase())).length,
                inProgress: issues.filter(e => e.fields.status.name.toUpperCase() === 'INVESTIGATE PROCESS').length,
                done: issues.filter(e => e.fields.status.name.toUpperCase() === 'INVESTIGATED').length,
                total: issues.filter(e => e.fields.status.name.toLowerCase() === 'false positive').length,
            };
        } else {
            return { status: 401 };
        }
    }

    @Get('traffic')
    async getTraffic(@Headers('authorization') accessToken: string): Promise<any> {
        if (validateAccessToken(accessToken, this.jwtService)) {
            const ch = new this.incidentService.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });
            const answer = await ch.querying(
                // tslint:disable-next-line:max-line-length
                    `SELECT count() FROM Etanol_PROD.DataFlow_v2 WHERE time_db_sec >  now() - 60 FORMAT JSONCompact`);
            // console.log(answer.data[0][0]);
            return answer.data[0][0];
        } else {
            return { status: 401 };
        }
    }
}
