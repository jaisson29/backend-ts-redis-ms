import { pinoHttp } from 'pino-http';
import express, { Application } from 'express';
import { API_POST_PORT } from '../config';
import postNetwork from './components/post/PostNetwork';
import SwaggerDoc from '../main/swagger.json';
import SwaggerUi from 'swagger-ui-express';
import { errors } from '../network/Error';
import logger from '../main/components/logger';

const app: Application = express();

app.use(express.json());

app.use(pinoHttp({ logger }));

app.use('/api/v1/post', postNetwork);

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerDoc));

app.use(errors);

app.listen(API_POST_PORT, () => logger.info(`Iniciado en http://localhost:${API_POST_PORT}`));
