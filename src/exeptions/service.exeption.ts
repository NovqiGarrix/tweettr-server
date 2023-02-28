interface IServiceExeptionContructorParams {
    code: number;
    status: string;
    error: string;
    cause?: unknown;
}

export class ServiceExeption extends Error {

    public code: number;
    public status: string;
    public error: string;
    public cause?: unknown;

    constructor(params: IServiceExeptionContructorParams) {
        super(params.error, { cause: params.cause });

        this.code = params.code;
        this.status = params.status;
        this.error = params.error;
    }

    public static createInternalError() {
        return new ServiceExeption({
            code: 500,
            status: 'Internal Server Error',
            error: 'Oops! Something went wrong.'
        });
    }

}