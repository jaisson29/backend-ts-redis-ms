import { Request, Response } from 'express';

export default class ApiResponse {
	static success(_req: Request, res: Response, message: unknown = '', status: number = 200) {
		res.status(status).json({
			error: false,
			status: status,
			content: message,
		});
	}

	static error(_req: Request, res: Response, message: unknown = '', status: number = 500) {
		res.status(status).json({
			error: true,
			status: status,
			content: message,
		});
	}
}
