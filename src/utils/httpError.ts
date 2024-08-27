import { NextFunction, Request } from "express"
import errorObject from "./errorObject"

type ErrorParams = {
    nextFunc: NextFunction
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    err: Error | unknown
    req: Request
    errorStatusCode: number
}

export default ({
    nextFunc,
    err,
    req,
    errorStatusCode = 500,
}: ErrorParams): void => {
    const errorObj = errorObject(err, req, errorStatusCode)
    return nextFunc(errorObj)
}
