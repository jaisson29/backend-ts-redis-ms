import { Store } from '../../../store/postgres';
import { Cache } from '../../../store/redis';
import { authController } from '../auth';
import { Auth } from '../auth/AuthModel';
import logger from '../logger';
import { User } from './UserModel';

export default class UserController {
  private readonly TABLE = `users`;

  constructor(private store: Store, private cache: Cache) {
    this.store = store;
    this.cache = cache;
  }

  async list() {
    let users = await this.cache.list(this.TABLE);
    if (!users) {
      users = await this.store.get(`${this.TABLE}`, {
        join: [
          {
            table: 'auth',
            on: {
              field: 'id',
            },
          },
        ],
      });
      logger.debug(users);
      this.cache.upsert(this.TABLE, users);
    }
    return users;
  }

  async get(id: string) {
    return await this.store.get<User>(this.TABLE, {
      where: {
        id: { table: this.TABLE, value: id },
      },
    });
  }

  async upsert(body: User & Auth) {
    const user: User = {
      id: body?.id,
      name: body?.name,
    };

    if (body.password && body.username) {
      const newAuth = await authController.upsert({
        id: user?.id,
        username: body?.username,
        password: body?.password,
      });
      user.id = newAuth.id;
      logger.info(newAuth);
    }

    return this.store.upsert<User>(this.TABLE, user);
  }

  async remove(id: string) {
    return await this.store.remove<User>(this.TABLE, id);
  }
}
