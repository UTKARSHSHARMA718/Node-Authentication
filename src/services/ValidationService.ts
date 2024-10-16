import Joi from "joi"
import { IRegisterRequestBody } from "../types/user"

export const validateRegisterBody = Joi.object<IRegisterRequestBody>({
    name: Joi.string().min(2).max(120).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string()
        .min(8)
        .max(16)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
        )
        .trim()
        .required(),
    mobile: Joi.string().min(8).max(16).trim().required(),
    image: Joi.string().trim(),
    consent: Joi.boolean().valid(true).required(),
})

export const validateSchema = <T>(schema: Joi.Schema, value: unknown) => {
    const result = schema.validate(value)

    return {
        value: result.value as T,
        error: result.error,
    }
}
