import {Module} from '@nestjs/common';
import {IncidentService} from './incident.service';
import {IncidentController} from './incident.controller';
import {JwtService} from '@nestjs/jwt';
import {AuthModule} from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [IncidentController],
    providers: [IncidentService],
})
export class IncidentModule {}
