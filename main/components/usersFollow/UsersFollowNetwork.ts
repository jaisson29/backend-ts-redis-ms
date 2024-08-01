import express, { NextFunction, Request, Response, Router } from 'express';
import ApiResponse from '../../../network/response';
import { userSecure } from '../user';
import { usersFollowController } from '.';
const router: Router = express.Router();

// Paths
router.post('/:userTo', userSecure.checkAuth('follow'), follow);
router.get('/:id', following);

// Methods
async function follow(req: Request, res: Response, next: NextFunction) {
	try {
		const { userTo } = req.params;
		const data = await usersFollowController.follow(req.user.id, userTo);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		next(error);
	}
}

async function following(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await usersFollowController.following(req.params.id);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		next(error);
	}
}

export default router;
