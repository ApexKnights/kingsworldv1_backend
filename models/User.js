import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    adhaar: {
        type: String,
        required: true,
    },
    pan: {
        type: String,
        required: true,
    },
    wallet: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        default: "client",
    },
    under: {
        type: String,
        default: "admin",
    },
    wallet2: {
        type: Number,
        default: 0,
    }
}, { timestamps: true })


export const User = mongoose.model("User", usersSchema)