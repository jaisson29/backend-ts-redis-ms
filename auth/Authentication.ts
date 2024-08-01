import { Request } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { UnauthorizedError } from '../network/AppError';

export default class Authentication {
  static sign(data: object) {
    return jwt.sign(data, JWT_SECRET);
  }

  own(req: Request, owner: string) {
    const tokenDecoded = this.decodeHeader(req);
    if (tokenDecoded.id !== parseInt(owner)) {
      throw new UnauthorizedError('Unauthorized to do this action');
    }
  }

  logged(req: Request) {
    this.decodeHeader(req);
  }

  getToken(auth: string) {
    if (!auth) {
      throw new Error('Token not provided');
    }

    if (auth.indexOf('Bearer ') === -1) {
      throw new Error('Token format not valid');
    }
    return auth.replace('Bearer ', '');
  }
  decodeHeader(req: Request): JwtPayload {
    const authorization = req.headers.authorization ?? '';
    const token = this.getToken(authorization);
    const decoded: JwtPayload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;

    return decoded;
  }
}
