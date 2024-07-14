import jwt from 'jsonwebtoken';

export default class Authentication {
	static sign(data: object) {
		return jwt.sign(data, 'secret');
	}
}
