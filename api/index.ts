import express, { Application } from 'express';
import { api_port } from '../config';
import userNetwork from './components/user/UserNetwork';
import authNetwork from './components/auth/AuthNetwork';
import morgan from 'morgan';
import SwaggerDoc from './swagger.json';
import SwaggerUi from 'swagger-ui-express';

const app: Application = express();

app.use(express.json());

app.use(morgan('combined'));

app.use('/api/v1/user', userNetwork);
app.use('/api/v1/auth', authNetwork);

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(SwaggerDoc));

app.listen(api_port, () => console.log(`Iniciado en http://localhost:${api_port}`));
