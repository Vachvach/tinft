import { NestFactory } from '@nestjs/core';
import { setupSwagger } from 'setup-swagger';
import { ApiConfigService } from 'src/services/api.config.service';
import { SharedModule } from 'src/services/shared.module';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.select(SharedModule).get(ApiConfigService).appConfig;
  setupSwagger(app, { version: '1.0.0' });

  await app.listen(config.port);
  console.info(`server running on port ${config.port}`);
  return app;
}
bootstrap();
