import mongoose from "mongoose";

const adsSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "Ads Provided by KingsWorld"
    },
    img: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 20
    },
    expire: {
        type: String,
        required: true
    },
    approvedby: {
        type: Array,
        default: []
    }
}, { timestamps: true })


export const Ads = mongoose.model("Ads", adsSchema)