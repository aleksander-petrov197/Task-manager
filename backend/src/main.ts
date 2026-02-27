import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 app.useGlobalPipes(new ValidationPipe({
  whitelist: true,         // This deletes any property not in the DTO
  forbidNonWhitelisted: false, 
  transform: true,         // This converts strings to numbers automatically
}));
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type, Accept, Authorization'],
  });
  await app.listen(3000, '127.0.0.1');


}
bootstrap();
