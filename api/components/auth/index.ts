import { PG_SCHEMA } from '../../../config';
import { Store } from '../../../store/postgres';
import AuthController from './AuthController';

const store = new Store(PG_SCHEMA);
export const authController = new AuthController(store);
