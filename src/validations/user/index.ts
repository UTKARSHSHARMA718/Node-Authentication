import { check } from "express-validator"
// import { VALID_IMAGE_TYPES } from "../../constant/const"

export const UserRegisterValidation = [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required!")
        .isEmail()
        .normalizeEmail({ gmail_remove_dots: true }),
    check("mobile", "Mobile No. should be  contains `0 digits").isLength({
        min: 10,
        max: 10,
    }),
    check(
        "password",
        "Password must be having at least one number, one Symbol, one Lowercase character, one uppercase character and length in between 8 to 16"
    )
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1,
        })
        .isLength({
            min: 8,
            max: 16,
        }),
    check("image")
        .custom((value, { req }) => {
            if (typeof value === "string") {
                return true
            }
            return false
        })
        .withMessage("Image should be of either PNG or JPEG type only!"),
]

export const SendEmailVerificationValidation = [
    check("email", "Email is required!").not().isEmpty().isEmail(),
]

export const checkEmailVerificationValidation = [
    check("email", "Email is required!").not().isEmpty().isEmail(),
    check("pincode", "Wrong pincode!")
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 6 }),
]

export const forgotPasswordValidation = [
    check("email", "Email is required!").not().isEmpty().isEmail(),
]

export const changePasswordValidation = [
    check("email", "Email is required!").not().isEmpty().isEmail(),
    check("pincode", "Pincode is required").not().isEmpty().isEmail(),
    check(
        "newPassword",
        "New Password must be having at least one number, one Symbol, one Lowercase character, one uppercase character and length in between 8 to 16"
    )
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1,
        })
        .isLength({
            min: 8,
            max: 16,
        }),
]

export const ResetPasswordValidation = [
    check("email", "Email is required!").not().isEmpty().isEmail(),
    check(
        "password",
        "Password must be having at least one number, one Symbol, one Lowercase character, one uppercase character and length in between 8 to 16"
    )
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1,
        })
        .isLength({
            min: 8,
            max: 16,
        }),
    check(
        "newPassword",
        "New Password must be having at least one number, one Symbol, one Lowercase character, one uppercase character and length in between 8 to 16"
    )
        .isStrongPassword({
            minLength: 8,
            minNumbers: 1,
            minLowercase: 1,
            minSymbols: 1,
            minUppercase: 1,
        })
        .isLength({
            min: 8,
            max: 16,
        }),
]
