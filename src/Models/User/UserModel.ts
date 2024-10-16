import mongoose from "mongoose"
import { IUser } from "../../types/user"
import { EROLE } from "../../constant/const"

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        pdf: {
            filename: {
                type: String,
                required: true,
                default: null,
            },
            data: {
                type: Buffer,
                required: true,
                default: null,
            },
            contentType: {
                type: String,
                required: true,
                default: null,
            },
        },
        mobile: {
            countryCode: {
                type: String,
                required: true,
            },
            isoCode: {
                type: String,
                required: true,
            },
            internationalNumber: {
                type: String,
                required: true,
            },
        },
        timezone: {
            required: true,
            type: String,
        },
        role: {
            type: String,
            required: true,
            enum: EROLE,
            default: EROLE.USER,
        },
        accountConfirmation: {
            _id: false,
            status: {
                type: String,
                required: true,
            },
            token: {
                type: String,
                required: true,
            },
            code: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: null,
            },
        },
        passwordReset: {
            _id: false,
            token: {
                type: String,
                default: null,
            },
            expiry: {
                type: String,
                default: null,
            },
            lastResetAt: {
                type: Date,
                default: null,
            },
        },
        lastLoginAt: {
            type: Date,
            default: null,
        },
        consent: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model<IUser>("USER", UserSchema)
