import { pinoHttp } from 'pino-http';
import express, { Application } from 'express';
import { api_port } from '../config';
import userNetwork from './components/user/UserNetwork';
import authNetwork from './components/auth/AuthNetwork';
import postNetwork from './components/post/PostNetwork';
import usersFollowNetwork from './components/usersFollow/UsersFollowNetwork';
import SwaggerDoc from './swagger.json';
import SwaggerUi from 'swagger-ui-express';
import logger from './components/logger';
import { errors } from '../network/Error';

const app: Application = express();

app.use(express.json());

app.use(pinoHttp({ logger }));

app.use('/api/v1/user', userNetwork);
app.use('/api/v1/auth', authNetwork);
app.use('/api/v1/post', postNetwork);
app.use('/api/v1/follow', usersFollowNetwork);

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerDoc));

app.use(errors);

app.listen(api_port, () => logger.info(`Iniciado en http://localhost:${api_port}`));
