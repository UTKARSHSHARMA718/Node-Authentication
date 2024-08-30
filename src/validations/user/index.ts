import { check } from "express-validator"
import { VALID_IMAGE_TYPES } from "../../constant/const"

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
    ).isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minLowercase: 1,
        minSymbols: 1,
        minUppercase: 1,
    }).isLength({
        min:8,
        max:16
    }),
    check('image').custom((value, {req})=>{
        if(VALID_IMAGE_TYPES.includes(req?.file?.mimetype)){
            return true;
        }

        return false;
    }).withMessage('Image should be of either PNG or JPEG type only!')
]
