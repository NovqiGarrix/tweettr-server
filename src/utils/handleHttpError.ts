import type { Response } from 'express';
import { ServiceExeption } from '../exeptions/service.exeption';

export default function handleHttpError(res: Response, error: any) {
    if (error instanceof ServiceExeption) {
        return res.status(error.code)
            .send({
                code: error.code,
                status: error.status,
                errors: [
                    {
                        error: error.error,
                    }
                ]
            });
    }

    return res.status(500)
        .send({
            code: 500,
            status: "Internal Server Error",
            errors: [
                {
                    error: "Internal Server Error",
                    message: "Please try again later",
                    path: "server"
                }
            ]
        });
}