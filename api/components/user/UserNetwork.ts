import express, { Request, Response, Router } from 'express';
import ApiResponse from '../../../network/response';
import { userController } from '.';

const router: Router = express.Router();

// Paths
router.get('/', list);
router.get('/:id', get);
router.post('/', upsert);
router.put('/', upsert);

// Methods
async function get(req: Request, res: Response) {
	try {
		const { id } = req.params;
		const data = await userController.get(id);
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		if (error instanceof Error) {
			ApiResponse.error(req, res, error?.message, 500);
		}
	}
}

async function list(req: Request, res: Response) {
	try {
		const data = await userController.list();
		ApiResponse.success(req, res, data, 200);
	} catch (error) {
		if (error instanceof Error) {
			ApiResponse.error(req, res, error?.message, 500);
		}
	}
}

async function upsert(req: Request, res: Response) {
	try {
		const response = await userController.upsert(req.body);
		ApiResponse.success(req, res, response, 201);
	} catch (error) {
		if (error instanceof Error) {
			ApiResponse.error(req, res, error?.message, 500);
		}
	}
}

export default router;
