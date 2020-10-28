import { Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [ContactsModule,
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }), AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer): any {
        consumer.apply([CorsMiddleware]).forRoutes({ path: '*', method: RequestMethod.ALL })
    }
}

class CorsMiddleware implements NestMiddleware {
    resolve(): any {
        return (req, res, next) => {
            let allowedOrigins = ["http://localhost:3000", "https://w11k.de"];
            if (allowedOrigins.indexOf(req.header("Origin")) >= -1) {
                res.header("Access-Control-Allow-Origin", req.header("Origin"));
                res.header("Access-Control-Allow-Headers", "content-type");
                res.header("Access-Control-Allow-Methods", "POST");
            }

            next();
        };
    }
}
