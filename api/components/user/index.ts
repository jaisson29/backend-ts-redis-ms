import UserController from './UserController';
import UserSecure from './UserSecure';
import { Store } from '../../../store/postgres';
import { PG_SCHEMA } from '../../../config';

const store = new Store(PG_SCHEMA);

export const userController = new UserController(store);

export const userSecure = new UserSecure();
