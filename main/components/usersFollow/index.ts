import { PG_SCHEMA } from '../../../config';
import { Store } from '../../../store/postgres';
import UsersFollowController from './UsersFollowController';

const store = new Store(PG_SCHEMA);
export const usersFollowController = new UsersFollowController(store);
