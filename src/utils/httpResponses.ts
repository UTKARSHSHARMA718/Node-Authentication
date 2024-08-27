import { Request, Response } from "express"
import { THttpResponse } from "../types/types"
import { EApplicationEnvironment } from "../constant/const"
import logger from "./logger"

export default (
    req: Request,
    res: Response,
    responseStatusCode: number,
    responseMessage: string,
    data: unknown = null
): void => {
    const response: THttpResponse = {
        success: true,
        statusCode: responseStatusCode,
        request: {
            ip: req?.ip,
            method: req?.method,
            url: req.originalUrl,
        },
        message: responseMessage,
        data: data,
    }

    // Log
    logger.log("Controller Response", {
        meta: response,
    })

    // Production Env Check
    if (process.env.ENV_STATE === EApplicationEnvironment.PRODUCTION) {
        delete response.request.ip
    }

    res.status(responseStatusCode).json(response)
}
