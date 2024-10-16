import mongoose from "mongoose"

const EmailVerificationSchema = new mongoose.Schema(
    {
        pincode: {
            type: Number,
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

export default mongoose.model("EmailVerification", EmailVerificationSchema)
