import jwt from "jsonwebtoken"
import { User } from "../models/User.js";


export const IsAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json("Sorry, User is not authenticated")
    }
    else {
        jwt.verify(token, process.env.JWT_SECRET)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded._id);
        next();
    }
}