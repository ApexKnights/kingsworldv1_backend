import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js"
import requestRouter from "./routes/request.js"
import userRouter from "./routes/user.js"
import adsRouter from "./routes/ads.js"
import cors from "cors"

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

const __dirname = path.resolve();


const app = express();


app.use(cors({
    origin: "https://kingsworldofficial.in",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use("/images", express.static(path.join(__dirname, "/images")))
app.use("/api/v1/request", requestRouter)
app.use("/api/v1/auth", authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/ads', adsRouter)

app.get("/", (req, res) => {
    res.send("App is Running Successfully;")
})

const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { dbName: "KWDatabase" });
        console.log("KingsWorld has been connected successfully with KingsWorldDB 🎇❤")
    } catch (error) {
        console.log(error)
    }
}



// File Upload routes
const ads_storage = multer.diskStorage({
    destination: (req, res, fn) => {
        fn(null, "images")
    },
    filename: (req, res, fn) => {
        // fn(null, req.body.image)
        fn(null, "m-logo.png")
    }
})

const ads_upload = multer({ storage: ads_storage })


const config = cloudinary;

config.config({
    cloud_name: process.env.CR_NAME,
    api_key: process.env.CR_KEY,
    api_secret: process.env.CR_SECRET,
    secure: true
})

app.post("/api/v1/upload", ads_upload.single("file"), (req, res) => {
    config.uploader.upload(req.file.path, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).json({
                success: false,
                message: err
            })
        } else {
            res.status(200).json({
                success: true,
                message: result
            })
        }
    })
})





app.listen(5000, () => {
    ConnectDb();
    console.log("App is Running")
})