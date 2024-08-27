import { Request } from "express"
import { THttpError } from "../types/types"
import { EApplicationEnvironment } from "../constant/const"
import responseMessage from "../constant/responseMessage"
import logger from "./logger"

export default (
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    err: Error | unknown,
    req: Request,
    errorStatusCode: number = 500
): THttpError => {
    const errorObj: THttpError = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message:
            err instanceof Error
                ? err.message || responseMessage.SOMETHING_WENT_WRONG
                : responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? { error: err.stack } : null,
    }

    //Logs
    logger.info("Controller Response", {
        meta: errorObj,
    })

    //Production check
    if (process.env.ENV_STATE === EApplicationEnvironment.PRODUCTION) {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj 
}
