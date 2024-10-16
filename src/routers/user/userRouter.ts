import express from "express"
import multer from "multer"
import path from "path"
import {
    GetPdf,
    Register,
    UploadImage,
    UploadPdf,
} from "../../controllers/user/userController"

const userRouter = express.Router()
const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, path.join(__dirname, "..", "..", "..", "public", "images"))
            return
        }

        if (file?.mimetype === "application/pdf") {
            cb(null, path.join(__dirname, "..", "..", "..", "public", "pdfs"))
            return
        }
    },
    filename: (_req, file, cb) => {
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

userRouter.post("/upload", uploads.single("profile-pic"), UploadImage)

userRouter.post("/pdf/:email", uploads.single("pdf"), UploadPdf)

userRouter.get("/pdf/:email", uploads.single("pdf"), GetPdf)

userRouter.post("/register", Register)

userRouter.put("/forgot-password")

export default userRouter
