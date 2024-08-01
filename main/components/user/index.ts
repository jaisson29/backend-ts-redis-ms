import UserController from './UserController';
import UserSecure from '../middleware/UserSecure';
import { PG_SCHEMA } from '../../../config';
import { Store } from '../../../store/postgres';

const store = new Store(PG_SCHEMA);

export const userController = new UserController(store);

export const userSecure = new UserSecure();
