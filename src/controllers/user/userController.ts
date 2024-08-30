import { NextFunction, Request, Response } from "express"
import User from "../../Models/User/UserModel"
import httpError from "../../utils/httpError"
import httpResponses from "../../utils/httpResponses"
import { validationResult } from "express-validator"

export const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password, mobile } = req?.body || {}
        const fileName = req?.file?.filename ?? {}
        const isUserInputInvalid = validationResult(req)

        console.log({ isUserInputInvalid })
        if (isUserInputInvalid) {
            return httpError({
                req,
                nextFunc: next,
                err: isUserInputInvalid,
                errorStatusCode: 400,
            })
        }
        const userExist = await User.findOne({ email })

        if (userExist) {
            return httpError({
                req,
                errorStatusCode: 400,
                nextFunc: next,
                err: "User Exist!",
            })
        }

        const newUser = await User.create({
            name,
            email,
            password,
            mobile,
            image: fileName,
        })

        await newUser.save()

        httpResponses(req, res, 200, "User Registered Successfully!", newUser)
    } catch (err) {
        httpError({
            req,
            errorStatusCode: 500,
            nextFunc: next,
            err,
        })
    }
}
