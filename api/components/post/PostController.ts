import { Store } from '../../../store/postgres';
import { Post } from './PostModel';

export default class UserController {
	private readonly TABLE = `post`;

	constructor(private store: Store) {
		this.store = store;
	}

	async list() {
		return await this.store.get(`${this.TABLE}`, {
			join: [
				{
					table: 'users',
					on: {
						field: 'userId',
					},
				},
			],
		});
	}

	async get(id: string) {
		return await this.store.get<Post>(this.TABLE, {
			where: {
				id: { table: this.TABLE, value: id },
			},
		});
	}

	async upsert(body: Post) {
		return this.store.upsert<Post>(this.TABLE, body);
	}

	async remove(id: string) {
		return await this.store.remove<Post>(this.TABLE, id);
	}
}
