import { Injectable } from '@nestjs/common';
import { IncidentDTO, VariationStatus, VariationType } from './incident.interface';
import { IncidentsState } from './state';
import * as lod from 'lodash';
import * as fs from 'fs';
import { Cron, NestSchedule } from 'nest-schedule';

const JiraApi = require('jira-client');

@Injectable()
export class IncidentService extends NestSchedule {
    private incidentsArr: IncidentDTO[] = IncidentsState.getInstance().incidents;

    @Cron('0 * * * * *')
    async scheduledJobForCH() {
        const ch = new this.ClickHouse({ host: 'srv-ch-11.int.soc.secure-soft.tech' });
        const answer = await ch.querying(`SELECT count() FROM Etanol_PROD.DataFlow_v2 WHERE time_db_sec >  now() - 60 FORMAT JSONCompact`);
        const maxLines = 30;
        const date = new Date().toString().split(' ')[4].split(':').slice(0, -1).join(':');
        const writeData = Math.round(+answer.data[0][0] / 60);
        if (fs.existsSync('./ch.json')) {
            fs.readFile('./ch.json', (err, data) => {
                if (!data.toString().length) {
                    fs.writeFile('./ch.json', JSON.stringify([{ [date]: writeData }]), err => {
                        if (err) console.log(err);
                    });
                    return;
                }
                const dataFromFile = JSON.parse(data.toString());
                if (dataFromFile.length > maxLines) {
                    dataFromFile.splice(0, dataFromFile.length - maxLines);
                }
                dataFromFile.push({ [date]: writeData });
                fs.writeFile('./ch.json', JSON.stringify(dataFromFile), err => {
                    if (err) console.log(err);
                });
            });
        } else {
            fs.writeFile('./ch.json', JSON.stringify([{ [date]: writeData }]), err => {
                if (err) console.log(err);
            });
        }
    }

    public jira = new JiraApi({
        protocol: 'https',
        host: 'sd.soc.secure-soft.tech',
        username: 'web-app-user',
        password: 'ZLn8g$uLpZurnZ',
        apiVersion: '2',
        strictSSL: true,
    });

    public ClickHouse = require('@apla/clickhouse');

    constructor() {
        super();
    }

    public getIncidents(): IncidentDTO[] {
        return this.incidentsArr;
    }

    private getCountIncidentByType(type: VariationType): number {
        return lod.filter(
            this.incidentsArr,
            (incident: IncidentDTO): boolean => {
                return incident.type === type;
            },
        ).length;
    }

    public getIncidentsByType(): {
        critical: number,
        normal: number,
        warning: number,
    } {
        return {
            critical: this.getCountIncidentByType('critical'),
            normal: this.getCountIncidentByType('normal'),
            warning: this.getCountIncidentByType('warning'),
        };
    }

    private getCountIncidentPerDay(): number {
        const dayMillis = 24 * 3600 * 1000;
        return lod.filter(
            this.incidentsArr,
            (incident: IncidentDTO): boolean => {
                return new Date().getTime() - incident.timeStamp.getTime() <= dayMillis;
            },
        ).length;
    }

    private getCountIncidentByStatus(status: VariationStatus): number {
        return lod.filter(
            this.incidentsArr,
            (incident: IncidentDTO): boolean => {
                return incident.status === status;
            },
        ).length;
    }

    public getIncidentsTotalInfo(): {
        total: number,
        perday: number,
        unresolved: number,
        resolved: number,
    } {
        return {
            total: this.incidentsArr.length,
            perday: this.getCountIncidentPerDay(),
            unresolved: this.getCountIncidentByStatus('unresolved'),
            resolved: this.getCountIncidentByStatus('resolved'),
        };
    }
}
