import express, { Request, Response, NextFunction } from "express"
import path from "path"
import router from "./routers/apiRouter"
import globalErrorHandler from "./middleware/globalErrorHandler"
import responseMessage from "./constant/responseMessage"
import httpError from "./utils/httpError"
import helmet from "helmet"
import cors from "cors"
import swaggerUI from "swagger-ui-express"
import swaggerOutput from "../swagger_output.json"
import sessions from "express-session"

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

// set the view engine to ejs
app.set("view engine", "ejs")

app.use(express.json())

app.use(express.static(path.join(__dirname, "../", "public")))
app.use(express.static(path.join(__dirname, "../", "views")))

app.use(
    "/api/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerOutput, { explorer: true })
)

app.use(sessions({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET! 
}));

app.set("views", path.join(__dirname, "../", "views"))

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
