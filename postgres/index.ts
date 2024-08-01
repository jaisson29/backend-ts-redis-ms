import express, { Application } from 'express';
import PostgresRouter from './network';
import { PG_SERVICE_PORT } from '../config';
import pinoHttp from 'pino-http';
import logger from '../main/components/logger';

const app: Application = express();

app.use(pinoHttp({ logger }));
app.use(express.json());

app.use('/', PostgresRouter);

app.listen(PG_SERVICE_PORT);
