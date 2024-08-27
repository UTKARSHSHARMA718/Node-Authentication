import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        required: true,
    },
})

export default mongoose.model("USER", UserSchema)
