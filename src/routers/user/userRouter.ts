import express, { Request, Response } from "express"
import multer from "multer"
import path from "path"
import { Register } from "../../controllers/user/userController"

const userRouter = express.Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, path.join(__dirname, "..", "..", "..", "public", "images"))
            return
        }
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + "-" + file.originalname
        cb(null, fileName)
    },
})
const uploads = multer({
    storage,
    limits: {
        fileSize: 50000000, // 5mb
    },
})

userRouter.post("/upload", uploads.single("profile-pic"))

userRouter.post("/register", Register)

export default userRouter
