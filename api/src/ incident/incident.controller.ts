import {Get, Controller, Param} from '@nestjs/common';
import {IncidentService} from './incident.service';
import { JwtService } from '@nestjs/jwt';
import {IncidentDTO} from './incident.interface';
import {Repository} from 'typeorm';

@Controller('incident')
export class IncidentController{
    constructor(private readonly incidentService: IncidentService) {
    }

    @Get()
    getIncidents(): IncidentDTO[]{
        return this.incidentService.getIncidents();
    }

    @Get('/bytype')
    getIncidentsByType(): {
        critical: number,
        normal: number,
        warning: number,
    }{
        return this.incidentService.getIncidentsByType();
    }

    @Get('/total')
    getIncidentsTotal(): {
        total: number,
        perday: number,
        unresolved: number,
        resolved: number,
    }{
        return this.incidentService.getIncidentsTotalInfo();
    }
}