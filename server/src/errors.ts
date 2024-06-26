export class BaseError {
    statusCode: number
    message: string

    constructor(statusCode: number, message: string) {

        this.statusCode = statusCode;
        this.message = message
    }
}

export class ParameterError extends BaseError {
    static readonly code = 422;

    constructor(message: string) {
        super(ParameterError.code, message);
    }
}

export class InternalServerError extends BaseError {
    static readonly code = 500;

    constructor(message: string) {
        super(DatabaseError.code, message);
    }
}

export class DatabaseError extends BaseError {
    static readonly code = 503

    constructor(message: string) {
        super(DatabaseError.code, message);
    }
}