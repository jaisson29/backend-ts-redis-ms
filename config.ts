import { PoolConfig } from 'pg';
import { config } from 'dotenv';

config();

export const api_port: number = parseInt(process.env.API_PORT ?? '3000', 10);
export const JWT_SECRET = process.env.JWT_SECRET ?? 'notASecret';

export const PG_HOST: string = process.env.PG_HOST ?? 'localhost';
export const PG_SCHEMA: string = process.env.PG_SCHEMA ?? '';
export const PG_USERNAME: string = process.env.PG_USERNAME ?? 'postgres';
export const PG_PASSWORD: string = process.env.PG_PASSWORD ?? '';
export const PG_DB: string = process.env.PG_DB ?? 'postgres';
export const PG_PORT: number = parseInt(process.env.PG_PORT ?? '5432', 10);
export const PG_URL = process.env.PG_URL ?? '';
export const PG_SSL: boolean = process.env.PG_URL === 'true';

export const PG_CONFIG: PoolConfig =
  PG_URL === ''
    ? {
        host: PG_HOST,
        database: PG_DB,
        port: PG_PORT,
        user: PG_USERNAME,
        password: PG_PASSWORD,
        ssl: PG_SSL,
      }
    : { connectionString: PG_URL };
export const PG_SERVICE_PORT = parseInt(process.env.PG_SERVICE_PORT ?? '3001', 10);
export const API_POST_PORT = parseInt(process.env.API_POST_PORT ?? '3002', 10);
