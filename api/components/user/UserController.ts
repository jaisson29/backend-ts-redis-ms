import { Store } from '../../../store/postgres';
import { authController } from '../auth';
import { Auth } from '../auth/AuthModel';
import logger from '../logger';
import { User } from './UserModel';
import { Follow } from '../follow/FollowModel';

export default class UserController {
	private readonly TABLE = `users`;

	constructor(private store: Store) {
		this.store = store;
	}

	async list() {
		return await this.store.getFiltered(`${this.TABLE}`, {}, true, [
			{
				table: 'auth',
				on: {
					field: 'id',
				},
			},
		]);
	}

	async get(id: string) {
		return await this.store.getFiltered<User>(this.TABLE, {
			id: { table: this.TABLE, value: id },
		});
	}

	async follow(idFrom: string, idTo: string) {
		const userFrom = await this.store.get<User>(this.TABLE, idFrom);
		const userTo = await this.store.get<User>(this.TABLE, idTo);
		if (!userFrom || !userTo) {
			throw new Error('User not found');
		}
		return this.store.upsert<Follow>('users_follow', new Follow(0, userFrom.id, userTo.id));
	}

	async following(id: string) {
		return await this.store.getFiltered('users_follow', { userFrom: { table: 'users_follow', value: id } }, true, [
			{
				table: `users`,
				on: {
					field: 'userFrom',
				},
			},
		]);
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
