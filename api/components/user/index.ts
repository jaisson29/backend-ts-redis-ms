import UserController from './UserController';
import Store from '../../../store/dummy';

const store = new Store();
export const userController = new UserController(store);
