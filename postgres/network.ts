import express, { NextFunction, Request, Response, Router } from 'express';
import ApiResponse from '../network/response';
import { Store } from '../store/postgres';
import logger from '../api/components/logger';
const router: Router = express.Router();
router.get('/', query);
router.get('/:table', list);
router.post('/get/:table', get);
router.post('/:table', insert);
router.put('/:table', upsert);
router.delete('/:table/:id', remove);
const store = new Store('back_redis_ts');

async function query(req: Request, res: Response, _next: NextFunction) {
	const datos = await store.query(req.body.query, req.body.params);
	ApiResponse.success(req, res, datos, 200);
}
async function list(req: Request, res: Response, _next: NextFunction) {
	const datos = await store.list(req.params.table);
	ApiResponse.success(req, res, datos, 200);
}
async function get(req: Request, res: Response, _next: NextFunction) {
	logger.debug(req, "Request");
	try {
		const datos = await store.get(req.params.table, req.body.options);
		ApiResponse.success(req, res, datos, 200);
	} catch (error) {
		logger.error(error);
		res.send("fallo")
	}
}
async function insert(req: Request, res: Response, _next: NextFunction) {
	const datos = await store.upsert(req.params.table, req.body);
	ApiResponse.success(req, res, datos, 200);
}
async function upsert(req: Request, res: Response, _next: NextFunction) {
	const datos = await store.upsert(req.params.table, req.body);
	ApiResponse.success(req, res, datos, 200);
}
async function remove(req: Request, res: Response, _next: NextFunction) {
	const datos = await store.remove(req.params.table, req.params.id);
	ApiResponse.success(req, res, datos, 200);
}

export default router;
