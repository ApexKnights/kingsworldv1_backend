import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending"
    }
}, { timestamps: true })


export const Request = mongoose.model("Request", requestSchema)