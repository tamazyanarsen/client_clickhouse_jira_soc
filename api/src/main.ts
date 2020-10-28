import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestMiddleware } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
    await app.listen(3000);
}

bootstrap();
