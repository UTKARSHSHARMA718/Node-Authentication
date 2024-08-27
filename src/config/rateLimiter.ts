import { Connection } from "mongoose"
import { RateLimiterMongo } from "rate-limiter-flexible"
import logger from "../utils/logger"

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export let rateLimiterMongo: null | RateLimiterMongo = null

const DURATION = 60
const POINTS = 10

export const initRateLimiter = (mongooseConnection: Connection) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        rateLimiterMongo = new RateLimiterMongo({
            storeClient: mongooseConnection,
            points: POINTS,
            duration: DURATION,
        })
    } catch (err) {
        logger.error(err)
    }
}
