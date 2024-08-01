import { NextFunction, Request, Response } from 'express';
import Authentication from '../../../auth/Authentication';

export default class UserSecure {
	private auth: Authentication;

	constructor() {
		this.auth = new Authentication();
	}

	public checkAuth(action: string) {
		return (req: Request, _res: Response, next: NextFunction): void => {
			switch (action) {
				case 'update': {
					const owner: string = req.body.id;
					this.auth.own(req, owner);
					next();
					break;
				}
				case 'follow':
					this.auth.logged(req);
					next();
					break;
				case 'get':
				default:
					next();
					return;
			}
		};
	}
}
