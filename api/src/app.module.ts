import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ContactsModule} from './contacts/contacts.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from './auth/auth.module';
import {IncidentModule} from './ incident/incident.module';

@Module({
    imports: [ContactsModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }), AuthModule, IncidentModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
