import express, { NextFunction, Request, Response, Router } from 'express';
import ApiResponse from '../network/response';
import { Cache } from '../store/redis';
import logger from '../main/components/logger';
const router: Router = express.Router();

router.get('/:table', list);
router.get('/:table/:id', get);
router.post('/:table', insert);

const store = new Cache();

async function list(req: Request, res: Response, _next: NextFunction) {
  try {
    const datos = await store.list(req.params.table);
    ApiResponse.success(req, res, datos, 200);
  } catch (error) {
    logger.error(error);
    ApiResponse.error(req, res, 'Fallo en obtener cache', 500);
  }
}
async function get(req: Request, res: Response, _next: NextFunction) {
  try {
    const datos = await store.get(req.params.table, req.params.id);
    ApiResponse.success(req, res, datos, 200);
  } catch (error) {
    logger.error(error);
    res.send('fallo');
  }
}
async function insert(req: Request, res: Response, _next: NextFunction) {
  const datos = await store.upsert(req.params.table, req.body);
  ApiResponse.success(req, res, datos, 200);
}

export default router;
