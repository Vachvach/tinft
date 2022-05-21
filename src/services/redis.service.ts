import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}
  async set(key: string, value: string, expiry?: number): Promise<'OK' | null> {
    return expiry
      ? this.redisClient.set(key, value, 'EX', expiry)
      : this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async isCached(key: string, value: string): Promise<boolean> {
    const cachedValue = await this.get(key);

    return cachedValue === value;
  }
}
