import express, { Application } from 'express';
import CacheRouter from './network';
import { PG_SERVICE_CACHE } from '../config';
import pinoHttp from 'pino-http';
import logger from '../main/components/logger';

const app: Application = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use('/api/v1/', CacheRouter);

app.listen(PG_SERVICE_CACHE, () => logger.info(`Iniciado en http://localhost:${PG_SERVICE_CACHE}`));
