import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from './api.config.service';
import { RedisService } from './redis.service';

const providers = [ApiConfigService, RedisService];

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
