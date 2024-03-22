import {Response} from "express";
import {BaseError, InternalServerError} from "./errors";

export function humanize(x: number, fractionDigits: number) {
    return x.toFixed(fractionDigits).replace(/\.?0*$/,'');
}

export function handleException(err: unknown, res: Response) {
    if (err instanceof BaseError) {
        res.status(err.statusCode).json(err);
    } else {
        console.error(err);
        res.status(InternalServerError.code).json(new InternalServerError("The server run into an internal error."));
    }
}