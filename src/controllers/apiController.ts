import { Request, Response, NextFunction } from "express"
import HttpResponses from "../utils/httpResponses"
import responseMessage from "../constant/responseMessage"
import HttpError from "../utils/httpError"
import logger from "../utils/logger"
import quicker from "../utils/quicker"

export default {
    self: (req: Request, res: Response, next: NextFunction) => {
        try {
            HttpResponses(req, res, 200, responseMessage.SUCCESS)
        } catch (err: unknown) {
            logger.error(`Error occured in self route: ${err}`)
            HttpError({
                req,
                nextFunc: next,
                errorStatusCode: 500,
                err,
            })
        }
    },
    health: (req: Request, res: Response, next: NextFunction) => {
        try {
            const healthData = {
                applicationHealth: quicker.getApplicationHealth(),
                systemHealth: quicker.getSystemHealth(),
                timestamp: Date.now(),
            }
            HttpResponses(req, res, 200, responseMessage.SUCCESS, healthData)
        } catch (err: unknown) {
            logger.error(`Error occured in self route: ${err}`)
            HttpError({
                req,
                nextFunc: next,
                errorStatusCode: 500,
                err,
            })
        }
    },
}
