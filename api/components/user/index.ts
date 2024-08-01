import UserController from './UserController';
import UserSecure from '../middleware/UserSecure';
import { PG_HOST, PG_SERVICE_PORT } from '../../../config';
import { Store } from '../../../store/Remote';

const store = Store.getInstance(PG_HOST, PG_SERVICE_PORT);

export const userController = new UserController(store);

export const userSecure = new UserSecure();
