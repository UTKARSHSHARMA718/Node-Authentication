import express from "express"
import apiController from "../controllers/apiController"
import rateMitter from "../middleware/rateLimitterMiddleware"
import userRouter from "./user/userRouter"

const router = express.Router()

router.route("/self").get(rateMitter, apiController.self)
router.route("/health").get(apiController.health)

//User Router
router.use("/user", rateMitter, userRouter)

export default router
