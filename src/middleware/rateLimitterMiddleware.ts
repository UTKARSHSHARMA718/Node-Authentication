import { NextFunction, Request, Response } from "express"
import { rateLimiterMongo } from "../config/rateLimiter"
import httpError from "../utils/httpError"
import responseMessage from "../constant/responseMessage"
import { EApplicationEnvironment } from "../constant/const"

export default (req: Request, _: Response, next: NextFunction) => {
    if (process.env.ENV_STATE === EApplicationEnvironment.DEVELOPMENT) {
        return next()
    }

    if (rateLimiterMongo) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        rateLimiterMongo
            ?.consume(req.ip as string, 1)
            ?.then(() => {
                next()
            })
            ?.catch(() => {
                httpError({
                    nextFunc: next,
                    errorStatusCode: 429,
                    req,
                    err: new Error(responseMessage.TOO_MANY_REQUEST),
                })
            })
    }
}
