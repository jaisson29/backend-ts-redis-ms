import Store from '../../../store/dummy';
import AuthController from './AuthController';

const store = new Store();
export const authController = new AuthController(store);
