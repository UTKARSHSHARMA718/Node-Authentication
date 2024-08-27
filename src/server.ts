import app from "./app"
import dotenv from "dotenv"
import logger from "./utils/logger"
import databaseService from "./services/databaseService"
import { initRateLimiter } from "./config/rateLimiter"
dotenv.config()

const server = app.listen(process.env.PORT)

void (async () => {
    try {
        logger.info('Checking')
        const connection = await databaseService.connect()
        logger.info(`Database Connection is established`, {
            meta: {
                CONNECTION_NAME: connection?.name,
            },
        })

        initRateLimiter(connection!)
        logger.info("Rate Limiter initiated")

        logger.info("Application server is started", {
            meta: {
                port: process.env.PORT,
            },
        })
    } catch (err) {
        logger.info("Error occured while", {
            meta: err,
        })

        server.close((err: unknown) => {
            if (err) {
                logger.error("Error while closing server")
                return
            }
            logger.info("Application server closed successfully!")
        })
    }
})()
