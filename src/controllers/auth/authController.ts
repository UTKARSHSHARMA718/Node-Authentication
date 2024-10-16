import { NextFunction, Request, Response } from "express"

import User from "../../Models/User/UserModel"
import httpError from "../../utils/httpError"
import httpResponses from "../../utils/httpResponses"
import Handlebars from "handlebars"
import EmailVerification from "../../Models/User/EmailVerification"
import ForgotPasswordModel from "../../Models/User/ForgotPasswordModel"

import { sendMail } from "../../services/emailService"
import {
    getUrlWithQuery,
    isTimeDifferenceGreaterThan,
    readHtml,
} from "../../utils/helpers"
import { VALID_EMAIL_VERIFICATION_TIME_IN_MINUTES } from "../../constant/const"
import { validationResult } from "express-validator"
import { TValidationError } from "../../types/types"
import { v4 as uuidv4 } from "uuid"
import { EXPIRED_PINCODE, WRONG_PINCODE } from "../../constant/message"

export const sendEmailVerificationCode = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req?.body || {}
        const html = await readHtml("EmailVerification.hbs")
        if (!html) {
            throw new Error("Html file not found!")
        }
        const template = Handlebars.compile(html)
        const randomPinCode = uuidv4();
        const filledHtmlContent = template({
            verificationLink: getUrlWithQuery("user/email/verify", [
                { query: "code", value: randomPinCode },
                { query: "email", value: email },
            ]),
            email,
        })
        console.log({
            email,
            link: getUrlWithQuery("user/email/verify", [
                { query: "code", value: randomPinCode },
                { query: "email", value: email },
            ]),
        })
        // send email to user with code
        await sendMail(email, "Verification Email", filledHtmlContent)

        // storing same pin into db for later verification.
        // first check does any entry for current user already exist or not
        // if yes, then just update the value
        const emailExist = await EmailVerification.findOne({ email })
        const user = await User.findOne({ email });
        // @ts-ignore
        if (user && user?.isVerified) {
            return httpResponses(
                req,
                res,
                400,
                "Email is already verified!",
                null
            )
        }
        if (emailExist) {
            await EmailVerification.updateOne(
                {
                    email,
                },
                {
                    pincode: randomPinCode,
                }
            )
            httpResponses(
                req,
                res,
                200,
                "Verification Email Sent Successfully!",
                null
            )
            return
        }

        //otherwise, create a new entry for the user
        const newEmailEntry = await EmailVerification.create({
            pincode: randomPinCode,
            email,
        })

        await newEmailEntry?.save()

        httpResponses(
            req,
            res,
            200,
            "Verification Email Sent Successfully!",
            null
        )
    } catch (err) {
        httpError({ err, req, nextFunc: next, errorStatusCode: 500 })
    }
}

export const verifyEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, code } = req?.query || {}

        console.log("start 1")
        if (!email || !code) {
            return res.status(400).render("FailedEmailVerification", {
                message: "Email and verification code are required.",
            })
        }

        console.log("start 2")
        const emailExist = await EmailVerification.findOne({ email })
        if (!emailExist) {
            res?.status(400)?.render("FailedEmailVerification")
            return
        }
        console.log("start 3")
        const isPinCodeSame = emailExist?.pincode === +code
        const isVerifiedCodeStillValid = isTimeDifferenceGreaterThan(
            //@ts-ignore
            emailExist?.timestamps?.updatedAt,
            VALID_EMAIL_VERIFICATION_TIME_IN_MINUTES
        )
        console.log("start 4")
        if (!isPinCodeSame || !isVerifiedCodeStillValid) {
            res?.status(400)?.render("FailedEmailVerification")
        }

        console.log("start 5")
        //delete the verified entry from db
        await EmailVerification.deleteOne({ email })

        console.log("start 6")
        res?.render("SuccessfullEmailVerification")
    } catch (err) {
        httpError({ err, req, nextFunc: next, errorStatusCode: 500 })
    }
}

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // @ts-ignore
        const errors: TValidationError = validationResult(req)

        if (errors?.errors?.length) {
            return httpError({
                req,
                err: new Error(errors?.errors?.[0]?.msg),
                nextFunc: next,
                errorStatusCode: 400,
            })
        }

        const { email } = req?.body || {}

        //check does the user with provided email id exist or not
        const user = await User?.findOne({ email })
        console.log({ user, email })
        if (!user) {
            return httpError({
                req,
                err: new Error("User does not exist!"),
                nextFunc: next,
                errorStatusCode: 400,
            })
        }

        // Generating a randome one time password
        const randomPincode = Math.floor(Math.random() * 1000000);
        // Clear all the old entries if any
        await ForgotPasswordModel?.deleteMany({ email })

        // create a new entry
        const newEntry = await ForgotPasswordModel?.create({
            email,
            pincode: randomPincode,
        })

        await newEntry?.save()

        // Send email to user with pincode
        const html = await readHtml("ForgotPasswordEmail.hbs")

        if (!html) {
            throw new Error("Unable to find html template!")
        }
        const template = Handlebars.compile(html)
        const htmlFilledContent = template({
            email,
            pincode: randomPincode,
        })
        await sendMail(email, "Forpot-Password Verification", htmlFilledContent)
        httpResponses(
            req,
            res,
            200,
            "Forgot-password Email sent successfully!",
            null
        )
    } catch (err) {
        httpError({ err, req, nextFunc: next, errorStatusCode: 500 })
    }
}

export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { pincode, newPassoword, email } = req?.body || {}

        // @ts-ignore
        const errors: TValidationError = validationResult(req)

        if (!errors?.errors?.length) {
            return httpError({
                req,
                err: new Error(errors?.errors[0]?.msg),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        const user = await User?.findOne({ email })
        if (!user) {
            return httpError({
                req,
                err: new Error("Invalid Request, User does not exist!"),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        const forgotPasswordEntry = await ForgotPasswordModel?.findOne({
            email,
        })

        if (!forgotPasswordEntry) {
            return httpError({
                req,
                err: new Error("Invalid Request, wrong pincode!"),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        const isForgotPasswordEntryValid = isTimeDifferenceGreaterThan(
            forgotPasswordEntry?.updatedAt,
            5
        )
        const isPincodeCorrect = forgotPasswordEntry?.pincode === pincode

        if (!isPincodeCorrect || !isForgotPasswordEntryValid) {
            const errorMessage = !isForgotPasswordEntryValid
                ? EXPIRED_PINCODE
                : WRONG_PINCODE
            return httpError({
                req,
                err: new Error(`Invalid Request, ${errorMessage}`),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        //update the user password
        const updateUserObj = await User?.updateOne(
            { email },
            {
                password: newPassoword,
            }
        )

        //delete the forgot-password entry
        await ForgotPasswordModel?.deleteMany({ email })

        httpResponses(
            req,
            res,
            201,
            "Password Updated Successfully!",
            updateUserObj
        )
    } catch (err) {
        httpError({ req, nextFunc: next, errorStatusCode: 500, err })
    }
}

export const ResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        //@ts-ignore
        const errors: TValidationError = validationResult(req)

        if (errors?.errors?.length) {
            return httpError({
                req,
                err: new Error(errors?.errors[0]?.msg),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        const { email, password, newPassword } = req?.body || {}

        if (password === newPassword) {
            return httpError({
                req,
                err: new Error(
                    "Invalid Request, New and olds password are same!"
                ),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        const userExist = await User?.findOne({ email })
        if (!userExist) {
            return httpError({
                req,
                err: new Error("Invalid Request, User does not exist!"),
                errorStatusCode: 400,
                nextFunc: next,
            })
        }

        console.log({ userExist, password, newPassword })
        const isPasswordCorrect = userExist?.password === password
        if (!isPasswordCorrect) {
            return httpError({
                nextFunc: next,
                req,
                err: new Error(
                    "Incorrect password, try again with correct password!"
                ),
                errorStatusCode: 400,
            })
        }

        await User?.updateOne(
            { email },
            {
                password: newPassword,
            }
        )

        httpResponses(req, res, 201, "Password Reset successfully!", null)
    } catch (err) {
        httpError({ req, err, nextFunc: next, errorStatusCode: 500 })
    }
}
