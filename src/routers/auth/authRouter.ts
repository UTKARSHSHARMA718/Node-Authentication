import express from "express"
import {
    changePassword,
    forgotPassword,
    ResetPassword,
    sendEmailVerificationCode,
    verifyEmail,
} from "../../controllers/auth/authController"
import {
    ResetPasswordValidation,
    SendEmailVerificationValidation,
    changePasswordValidation,
    checkEmailVerificationValidation,
    forgotPasswordValidation,
} from "../../validations/user"
import "../../sso/passport"
import passport from "passport"

const authRouter = express.Router()

authRouter.post(
    "/email",
    SendEmailVerificationValidation,
    sendEmailVerificationCode
)

authRouter.get("/email/verify", checkEmailVerificationValidation, verifyEmail)

authRouter.put("/forgot-password", forgotPasswordValidation, forgotPassword)

authRouter.put("/change-password", changePasswordValidation, changePassword)

authRouter.put("/reset-password", ResetPasswordValidation, ResetPassword)

// SSO --------------------------------------------------------------------------
// Google
authRouter.use(passport.initialize())
authRouter.use(passport.session())

authRouter.get("/login/google", (req, res) => {
    res?.render("pages/google-auth/Auth.ejs")
})

authRouter.get("/success", (req, res) => {
    try {
        // @ts-ignore
        const accessToken = req?.session?.passport?.user?.accessToken
        //@ts-ignore
        console.log({ accessToken })

        if (!accessToken) {
            return res?.status(404)?.json({ message: "Not found Session!" })
        }
        // res?.render("pages/google-auth/Success.ejs")
        return res?.status(200)?.json({ message: "Session found!" })
    } catch (err) {
        return res?.status(500)?.json({ message: "Something went wrong!" })
    }
})

authRouter.get("/failure", (req, res) => {
    res?.render("pages/google-auth/Failure.ejs")
})

authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
)

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/api/v1/auth/success",
        failureRedirect: "/api/v1/auth/failure",
    })
)

// SSO --------------------------------------------------------------------------

export default authRouter
