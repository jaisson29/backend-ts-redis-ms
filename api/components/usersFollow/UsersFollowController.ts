import { Store } from '../../../store/postgres';
import { UsersFollow } from './UsersFollowModel';
import { User } from '../user/UserModel';

export default class UsersFollowController {
	private readonly TABLE = `users_follow`;

	constructor(private store: Store) {
		this.store = store;
	}

	async follow(idFrom: string, idTo: string) {
		const userFrom = await this.store.get<User>(this.TABLE, { where: { id: { table: this.TABLE, value: idFrom } } });
		const userTo = await this.store.get<User>(this.TABLE, { where: { id: { table: this.TABLE, value: idTo } } });
		if (!userFrom || !userTo) {
			throw new Error('User not found');
		}
		return this.store.upsert<UsersFollow>(this.TABLE, new UsersFollow(0, userFrom[0].id, userTo[0].id));
	}

	async following(id: string) {
		return await this.store.get<UsersFollow>('users_follow', {
			where: { userFrom: { table: this.TABLE, value: id } },
			join: [
				{
					table: `users`,
					on: {
						field: 'userFrom',
					},
				},
				{
					table: 'auth',
					on: {
						field: 'id',
					},
				},
			],
		});
	}
}
