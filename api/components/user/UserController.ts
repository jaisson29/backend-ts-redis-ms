import Store from '../../../store/dummy';
import { authController } from '../auth';
import { User } from './UserModel';

export default class UserController {
	private readonly TABLE = 'users';

	constructor(private store: Store) {
		this.store = store;
	}

	async list() {
		return await this.store.list<User>(this.TABLE);
	}

	async get(id: string) {
		return await this.store.get<User>(this.TABLE, id);
	}

	async upsert(body: User) {
		const user: User = {
			id: body?.id,
			name: body?.name,
			username: body?.username,
			password: body?.password,
		};

		if (body.password || body.username) {
			await authController.upsert({
				id: user?.id,
				username: user?.username,
				password: user?.password,
			});
		}

		return this.store.upsert<User>(this.TABLE, body);
	}
}
