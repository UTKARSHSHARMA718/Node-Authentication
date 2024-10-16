import { NextFunction, Request, Response } from "express"

import User from "../../Models/User/UserModel"
import httpError from "../../utils/httpError"
import httpResponses from "../../utils/httpResponses"

// import { validationResult } from "express-validator"
import { TFile } from "../../types/types"
import { IRegisterRequestBody } from "../../types/user"
import {
    validateRegisterBody,
    validateSchema,
} from "../../services/ValidationService"
import quicker from "../../utils/quicker"
import responseMessage from "../../constant/responseMessage"
import { EROLE } from "../../constant/const"
import { sendMail } from "../../services/emailService"
import fs from "fs"

export const UploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const file: TFile = req?.file!
        const { originalname, size, mimetype } = file
        httpResponses(req, res, 201, "File Uploaded Successfully!", {
            originalname,
            mimetype,
            size,
        })
    } catch (err) {
        httpError({ err, errorStatusCode: 500, nextFunc: next, req })
    }
}

export const UploadPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const file = req?.file
        const { email } = req?.params

        if (!file) {
            return httpError({
                err: new Error("No file is uploaded!"),
                req,
                errorStatusCode: 500,
                nextFunc: next,
            })
        }

        if (!email) {
            return httpError({
                err: new Error("No email is provided!"),
                req,
                errorStatusCode: 500,
                nextFunc: next,
            })
        }

        const user = await User?.findOne({ email })

        if (!user) {
            return httpError({
                err: new Error("User does not exist!"),
                req,
                errorStatusCode: 500,
                nextFunc: next,
            })
        }

        fs?.readFile(file?.path, async (error, data) => {
            if (error) {
                return httpError({
                    err: error,
                    req,
                    errorStatusCode: 500,
                    nextFunc: next,
                })
            }

            console.log({data})
            user.pdf.filename = file?.originalname
            user.pdf.data = data
            user.pdf.contentType = file?.mimetype

            await user?.save()
        })

        fs.unlink(file.path, (err) => {
            if (err) console.error("Error deleting file:", err)
        })

        httpResponses(req, res, 201, "The Pdf has been uploaded successfully!");
    } catch (err) {
        httpError({
            err,
            req,
            errorStatusCode: 500,
            nextFunc: next,
        })
    }
}

export const GetPdf = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email } = req?.params

        const user = await User?.findOne({ email })

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${user?.pdf?.filename}`,
        })
        res.send(user?.pdf.data) // Send the binary data
    } catch (err) {
        httpError({
            err,
            req,
            errorStatusCode: 500,
            nextFunc: next,
        })
    }
}

interface IRegisterBody extends Request {
    body: IRegisterRequestBody
}

export const Register = async (
    req: IRegisterBody,
    res: Response,
    next: NextFunction
) => {
    try {
        const body = req?.body || {}

        const { error, value } = validateSchema<IRegisterRequestBody>(
            validateRegisterBody,
            body
        )

        // input validation
        if (error) {
            return httpError({
                req,
                nextFunc: next,
                err: error,
                errorStatusCode: 422,
            })
        }

        const { name, email, password, mobile, image } = value

        const { isoCode, internationalNumber, countryCode } =
            quicker?.parsePhoneNumber(mobile)

        if (!isoCode || !internationalNumber || !countryCode) {
            return httpError({
                req,
                nextFunc: next,
                err: new Error(responseMessage?.INVALID_PHONE_NUMBER),
                errorStatusCode: 422,
            })
        }

        // checking for country timezone
        const timezone = quicker?.timezone(isoCode)
        if (!timezone || !timezone?.length) {
            return httpError({
                req,
                nextFunc: next,
                err: new Error(),
                errorStatusCode: 422,
            })
        }

        const userExist = await User.findOne({ email })

        // checking for existing user
        if (userExist) {
            return httpError({
                req,
                errorStatusCode: 400,
                nextFunc: next,
                err: new Error("User Exist!"),
            })
        }

        const hashedPassword = await quicker?.encryptString(password)

        const token = quicker?.generatedRandomeID()
        const code = quicker?.generateOTP(6)

        const payload = {
            name,
            email,
            image,
            password: hashedPassword,
            mobile: {
                countryCode,
                isoCode,
                internationalNumber,
            },
            accountConfirmation: {
                status: false,
                token,
                code,
                timestamp: null,
            },
            passwordReset: {
                token: null,
                expiry: null,
                lastResetAt: null,
            },
            lastLoginAt: null,
            role: EROLE?.USER,
            timezone: timezone?.[0]?.name,
            consent: true,
        }

        const newUser = await User.create(payload)
        // creating new user
        const createdUser = await newUser.save()

        const confirmationEmail = `${process?.env?.SERVER_URL}/api/v1/confirmation/${token}?code=${code}`
        const subject = "Please confirm your email by click this link."
        const content = `<p>${confirmationEmail}</p>`
        sendMail(email, subject, content)

        httpResponses(req, res, 200, "User Registered Successfully!", {
            _id: createdUser._id,
        })
    } catch (err) {
        httpError({
            req,
            errorStatusCode: 500,
            nextFunc: next,
            err,
        })
    }
}

interface IConfirmationParamsAndQuery extends Request {
    params: {
        token: string
    }
    query: {
        code: string
    }
}

export const confirmation = async (
    req: IConfirmationParamsAndQuery,
    res: Response,
    next: NextFunction
) => {
    try {
        const { params } = req || {}
        const { query } = req || {}

        const { token } = params
        const { code } = query

        if (!token || !code) {
            return httpError({
                req,
                err: new Error(responseMessage?.INVALID_TOKEN_OR_CODE),
                errorStatusCode: 422,
                nextFunc: next,
            })
        }

        const user = await User?.findOne({
            "accountConfirmation.token": token,
            "accountConfirmation.code": code,
        })

        if (!user) {
            return httpError({
                req,
                err: new Error(responseMessage?.INVALID_TOKEN_OR_CODE),
                errorStatusCode: 422,
                nextFunc: next,
            })
        }

        if (user?.accountConfirmation?.status) {
            return httpError({
                req,
                err: new Error(responseMessage?.ACCOUNT_ALREADY_CONFIRMED),
                errorStatusCode: 422,
                nextFunc: next,
            })
        }

        user.accountConfirmation.status = true
        user.accountConfirmation.timestamp = quicker?.getUTCTimezone()

        await user?.save()

        const content = `<p>The account has been verified/confirmed.</p>`
        sendMail(user.email, "Account Confirmation", content)

        httpResponses(req, res, 201, responseMessage?.EMAIL_CONFIRMATION)
    } catch (err) {
        return httpError({
            req,
            err: new Error(responseMessage?.SOMETHING_WENT_WRONG),
            errorStatusCode: 500,
            nextFunc: next,
        })
    }
}
