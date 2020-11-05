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
    @authDecorator()
    getIncidentsByType(): {
        critical: number,
        normal: number,
        warning: number,
    } {
        return this.incidentService.getIncidentsByType();
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

function authDecorator () {
    return (target: Object, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
        const method = descriptor.value;
        descriptor.value = function(...args) {
            console.time(propertyName || 'LogTime');
            const result = method.apply(this, args);
            console.timeEnd(propertyName || 'LogTime');
            return result;
        };
    };
};

