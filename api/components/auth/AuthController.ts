import Authentication from '../../../auth';
import Store from '../../../store/dummy';
import { Auth } from './AuthModel';

export default class AuthController {
	private readonly TABLE = 'auth';

	constructor(private store: Store) {}

	async login(data: Pick<Auth, 'username' | 'password'>) {
		const auth = await this.store.query<Auth>(this.TABLE, { username: data.username });
		const response = auth[0];
		if (response && response.password === data?.password) {
			return Authentication.sign(response);
		} else {
			throw new Error('Invalid info');
		}
	}

	async upsert(data: Auth) {
		const authData: Auth = {
			id: data.id,
			username: '',
			password: '',
		};

		if (data.username) {
			authData.username = data.username;
		}

		if (data.password) {
			authData.password = data.password;
		}

		return this.store.upsert(this.TABLE, authData);
	}
}
