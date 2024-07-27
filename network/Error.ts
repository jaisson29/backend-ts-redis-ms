import { NextFunction, Request, Response } from 'express';
import logger from '../api/components/logger';
import ApiResponse from './response';
import { AppError } from './AppError';

export function errors(error: AppError, req: Request, res: Response, _next: NextFunction) {
	logger.error(error);

	ApiResponse.error(req, res, error.message ?? 'Internal Error', error.status ?? 500);
}
