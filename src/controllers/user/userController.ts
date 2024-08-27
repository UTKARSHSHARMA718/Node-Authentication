import { NextFunction, Request, Response } from "express"
import User from "../../Models/User/UserModel"
import httpError from "../../utils/httpError"
import httpResponses from "../../utils/httpResponses"
import { z } from "zod"

export const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password, mobile } = req?.body || {}
        const fileName = req?.file?.filename || {}

        if (!name || !email || !password || !mobile) {
            return httpError({
                req,
                errorStatusCode: 400,
                nextFunc: next,
                err: "Invalid Request!",
        })
        }

        const userValidationObject = z.object({
            name: z.string({ message: "Must be a string" }),
            email: z
                .string({ message: "Must be a string" })
                .email("Must be an email!"),
            password: z
                .string()
                .min(8, "At of 8 characters")
                .max(16, "At max of 16 characters"),
            mobile: z.string().length(10, "Must be of length 10"),
        })

        const isUserInputValid = userValidationObject.parse({
            name,
            email,
            password,
            mobile,
        })

        if (!isUserInputValid) {
            console.log({ isUserInputValid })
            return httpError({
                req,
                errorStatusCode: 400,
                nextFunc: next,
                err: "Invalid Request!",
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
