import { NextFunction, Request, Response } from "express"
import { THttpError } from "../types/types"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (
    err: THttpError,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    __: NextFunction
) => {
    res.status(err.statusCode).json(err)
}
