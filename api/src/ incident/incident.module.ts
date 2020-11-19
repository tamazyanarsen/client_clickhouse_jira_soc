import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [AuthModule, JwtModule.register({
        secretOrPrivateKey: 'secret12356789',
    }),],
    controllers: [IncidentController],
    providers: [IncidentService],
})
export class IncidentModule {
}
