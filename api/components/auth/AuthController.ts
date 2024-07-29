import Authentication from '../../../auth/Authentication';
import { BadRequestError, UnauthorizedError } from '../../../network/AppError';
import { Auth } from './AuthModel';
import bcrypt from 'bcrypt';
import { Store } from '../../../store/postgres';
import logger from '../logger';

export default class AuthController {
	private readonly TABLE = `auth`;

	constructor(private store: Store) {}

	async login(data: Pick<Auth, 'username' | 'password'>) {
		const [response] = await this.store.get<Auth>(this.TABLE, {
			where: {
				username: { table: this.TABLE, value: data.username },
			},
		});
		if (!response) {
			throw new UnauthorizedError('Invalid username or password2');
		}

		const compare = await bcrypt.compare(data.password, response.password);

		if (!compare) {
			throw new UnauthorizedError('Invalid username or password');
		}
		return Authentication.sign(response);
	}

	async upsert(data: Auth) {
		if (!data.password || !data.username) {
			throw new BadRequestError('password and username must be provided');
		}

		const authData: Auth = {
			id: data.id,
			username: data.username,
			password: await bcrypt.hash(data.password, 10),
		};

		logger.debug(authData);
		return this.store.upsert<Auth>(this.TABLE, authData);
	}
}
