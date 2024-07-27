import { NextFunction, Request, Response, Router } from 'express';
import { authController } from '.';
import ApiResponse from '../../../network/response';

const router: Router = Router();

router.post('/', login);

async function login(req: Request, res: Response, next: NextFunction) {
	try {
		const token = await authController.login(req.body);
		ApiResponse.success(req, res, token, 200);
	} catch (error: unknown) {
		next(error);
	}
}

export default router;
