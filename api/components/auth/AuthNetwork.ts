import { Request, Response, Router } from 'express';
import { authController } from '.';
import ApiResponse from '../../../network/response';

const router: Router = Router();

router.post('/', login);

async function login(req: Request, res: Response) {
	try {
		const token = await authController.login(req.body);
		ApiResponse.success(req, res, token, 200);
	} catch (error) {
		if (error instanceof Error) {
			ApiResponse.error(req, res, error.message, 500);
		}
	}
}

export default router;
