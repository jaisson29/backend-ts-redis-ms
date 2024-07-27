export class AppError extends Error {
	constructor(private _content: unknown, private _status: number, message: string) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
	}
	public get content() {
		return this._content;
	}
	public set content(content: unknown) {
		this._content = content;
	}
	public get status() {
		return this._status;
	}
	public set status(status: number) {
		this._status = status;
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized') {
		super('', 401, message);
	}
}

export class NotFoundError extends AppError {
	constructor(message = 'Not Found') {
		super('', 404, message);
	}
}

export class BadRequestError extends AppError {
	constructor(message = 'Bad Request') {
		super('', 400, message);
	}
}

export class InternalServerError extends AppError {
	constructor(message = 'Internal server error') {
		super('', 500, message);
	}
}
