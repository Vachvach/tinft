import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IJwtConfig } from 'src/common/interfaces/IJwtConfig';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'src/strategies/snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  private getNumber(key: string): number {
    return Number(this.configService.get(key));
  }

  private getString(key: string, defaultValue?: string): string {
    return this.configService
      .get(key, defaultValue)
      .toString()
      .replace(/\\n/g, '\n');
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    const entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];

    return {
      entities,
      keepConnectionAlive: true,
      type: 'postgres',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get redisConfig() {
    return {
      host: this.getString('REDIS_HOST'),
      port: this.getNumber('REDIS_PORT'),
      password: this.getString('REDIS_PASSWORD'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  get authNonceExpiry(): number {
    return this.getNumber('METAMASK_NONCE_EXPIRATION');
  }

  get jwtConfig(): IJwtConfig {
    return {
      secret: this.getString('JWT_SECRET_KEY'),
      accessTokenExpiry: this.getNumber('ACCESS_TOKEN_EXPIRATION_TIME'),
      refreshTimeExpiry: this.getNumber('REFRESH_EXPIRATION_TIME'),
    };
  }
}
