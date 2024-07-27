import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(require('sanitize').middleware);
  // Temporary commented due to CORS issue (it overrides the enableCors())
  // app.use(helmet());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
