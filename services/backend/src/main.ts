
import { NestFactory } from '@nestjs/core';
import { AppModule } from '.././src/app.module';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  Enable JSON parsing for POST requests 
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true }));

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
}

bootstrap();
