import {Injectable} from '@nestjs/common';
import {IncidentDTO, VariationStatus, VariationType} from './incident.interface';
import {IncidentsState} from './state';
import * as lod from 'lodash';
import {Repository} from 'typeorm';

@Injectable()
export class IncidentService {
    private incidentsArr: IncidentDTO[] = IncidentsState.getInstance().incidents;

    constructor() {
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

    private getCountIncidentPerDay(): number{
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