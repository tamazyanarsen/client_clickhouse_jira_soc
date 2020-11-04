import {Injectable} from '@nestjs/common';
import {IncidentDTO, VariationType} from './incident.interface';
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

    private getCountIncidentOfType(type: VariationType): number {
        return lod.filter(
            this.incidentsArr,
            (incident: IncidentDTO): boolean => {
                return incident.type === type;
            },
        ).length;
    }

    public getIncidentsByType() {
        return {
            critical: this.getCountIncidentOfType('critical'),
            normal: this.getCountIncidentOfType('normal'),
            warning: this.getCountIncidentOfType('warning'),
        };
    }

    public getIncidentsTotalInfo() {

    }
}