import { REDIS_CONFIG } from '../config';
import logger from '../main/components/logger';
import { Item } from './db';
import { createClient } from 'redis';

export class Cache {
  private client;
  constructor() {
    this.client = createClient(REDIS_CONFIG);

    this.client.on('error', (err) => console.log('Redis Client Error', err));

    (async (client) => {
      await client.connect();
    })(this.client);
  }
  async list(table: string) {
    try {
      const result = await this.client.get(table);
      if (!result) {
        return null;
      }
      return JSON.parse(result);
    } catch (error) {
      logger.error('Error parsing JSON from Redis:', error);
      return null;
    }
  }
  async get<T>(table: string, id: string): Promise<T[]> {
    return JSON.parse((await this.client.get(`${table}_${id}`)) ?? '[]');
  }
  async upsert<T extends Item>(table: string, data: T) {
    logger.debug(data);
    let key = table;
    if (data && data.id) {
      key = `${key}_${data.id}`;
    }
    return await this.client.setEx(key, 10, JSON.stringify(data));
  }
}
