import express, { Request, Response, NextFunction } from "express"
import path from "path"
import router from "./routers/apiRouter"
import globalErrorHandler from "./middleware/globalErrorHandler"
import responseMessage from "./constant/responseMessage"
import httpError from "./utils/httpError"
import helmet from "helmet"
import cors from "cors"

const app = express()

//Middlewares
app.use(helmet())
app.use(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    cors({
        methods: ["GET", "POST", "PUT", "DELETE"],
        origin: process.env.ORIGIN_URL,
    })
)
app.use(express.json())
app.use(express.static(path.join(__dirname, "../", "public")))

//Routes
app.use("/api/v1", router)

//404 handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND("Route"))
    } catch (err) {
        httpError({ nextFunc: next, err, req, errorStatusCode: 404 })
    }
})

//Global Error Handler
app.use(globalErrorHandler)

export default app
