import { PG_SCHEMA } from '../../../config';
import { Store } from '../../../store/postgres';
import PostController from './PostController';

const store = new Store(PG_SCHEMA);
export const postController = new PostController(store);
