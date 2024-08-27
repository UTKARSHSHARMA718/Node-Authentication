import mongoose from "mongoose"
import logger from "../utils/logger"

export default {
    connect: async () => {
        try {
            await mongoose.connect(process.env.MONGODB_URL!)
            return mongoose.connection
        } catch (err) {
            logger.error(err)
            return null
        }
    },
}
