import express, { NextFunction, Request, Response, Router } from 'express';
import ApiResponse from '../../../network/response';
import { userController, userSecure } from '.';
const router: Router = express.Router();

// Paths
router.get('/', list);
router.get('/:id', get);
router.post('/follow/:userTo', userSecure.checkAuth('follow'), follow);
router.get('/follow/:id', following);
router.post('/', upsert);
router.put('/', userSecure.checkAuth('update'), upsert);
router.delete('/:id', remove);

// Methods
async function get(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const data = await userController.get(id);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		next(error);
	}
}

async function list(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await userController.list();
		ApiResponse.success(req, res, data, 200);
	} catch (error: unknown) {
		next(error);
	}
}

async function follow(req: Request, res: Response, next: NextFunction) {
	try {
		const { userTo } = req.params;
		const data = await userController.follow(req.user.id, userTo);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		next(error);
	}
}

async function following(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await userController.following(req.params.id);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		next(error);
	}
}

async function upsert(req: Request, res: Response, next: NextFunction) {
	try {
		const response = await userController.upsert(req.body);
		ApiResponse.success(req, res, response, 201);
	} catch (error) {
		next(error);
	}
}

async function remove(req: Request, res: Response, next: NextFunction) {
	try {
		const { id } = req.params;
		const response = userController.remove(id);

		ApiResponse.success(req, res, response, 200);
	} catch (error: unknown) {
		next(error);
	}
}

export default router;
