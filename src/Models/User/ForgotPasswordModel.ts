import mongoose from "mongoose"

const ForgotPasswordVerificationSchema = new mongoose.Schema(
    {
        pincode: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

export default mongoose.model(
    "ForgotPassword",
    ForgotPasswordVerificationSchema
)
