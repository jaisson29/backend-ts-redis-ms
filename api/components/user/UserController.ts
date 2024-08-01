import { Store } from '../../../store/Remote';
import { authController } from '../auth';
import { Auth } from '../auth/AuthModel';
import logger from '../logger';
import { User } from './UserModel';

export default class UserController {
	private readonly TABLE = `users`;

	constructor(private store: Store) {
		this.store = store;
	}

	async list() {
		return await this.store.get(`${this.TABLE}`, {
			join: [
				{
					table: 'auth',
					on: {
						field: 'id',
					},
				},
			],
		});
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
