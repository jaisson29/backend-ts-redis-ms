import express, { NextFunction, Request, Response, Router } from 'express';
import ApiResponse from '../../../network/response';
import { postController } from '.';
import { userSecure } from '../../../main/components/user';
const router: Router = express.Router();

// Paths
router.get('/', list);
router.get('/:id', get);
router.post('/', upsert);
router.put('/', userSecure.checkAuth('update'), upsert);
router.delete('/:id', remove);

// Methods
async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = await postController.get(id);
    ApiResponse.success(req, res, data, 200);
  } catch (error) {
    next(error);
  }
}

async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await postController.list();
    ApiResponse.success(req, res, data, 200);
  } catch (error: unknown) {
    next(error);
  }
}

async function upsert(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await postController.upsert(req.body);
    ApiResponse.success(req, res, response, 201);
  } catch (error) {
    next(error);
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const response = postController.remove(id);

    ApiResponse.success(req, res, response, 200);
  } catch (error: unknown) {
    next(error);
  }
}

export default router;
