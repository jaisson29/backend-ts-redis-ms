import UserController from './UserController';
import UserSecure from '../middleware/UserSecure';
import { PG_SCHEMA } from '../../../config';
import { Store } from '../../../store/postgres';
import { Cache } from '../../../store/redis';

const store = new Store(PG_SCHEMA);
const cache = new Cache();
export const userController = new UserController(store, cache);

export const userSecure = new UserSecure();
