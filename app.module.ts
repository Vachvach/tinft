import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { ApiConfigService } from 'src/services/api.config.service';
import { SharedModule } from 'src/services/shared.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SharedModule,
    RedisModule.forRootAsync({
      useFactory: (apiConfigService: ApiConfigService) => ({
        closeClient: true,
        config: apiConfigService.redisConfig,
      }),
      inject: [ApiConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (apiConfigService: ApiConfigService) =>
        apiConfigService.typeOrmConfig,
      inject: [ApiConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
