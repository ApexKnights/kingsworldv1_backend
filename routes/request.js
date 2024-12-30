import express from "express"
import { Request } from "../models/Request.js";
import { IsAuthenticated } from "../auth/authenticate.js";


const router = express.Router();


//* Requset for users

router.post("/user-request", async (req, res) => {
    try {
        const { username, address, mobile, email, adhaar, pan } = req.body;
        const req_aproved = await Request.create({
            username,
            address,
            mobile,
            email,
            adhaar,
            pan
        })
        res.status(201).json({
            success: true,
            response: "Requset has been successfully sent, We will contact you shortly"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            response: "Someting went wrong"
        })
    }
})


// !make it isAuthenticated
router.get("/get-requests", IsAuthenticated, async (req, res) => {
    try {
        const get_requests = await Request.find();
        res.status(200).json({
            success: true,
            response: get_requests
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            response: "Someting went wrong"
        })
    }
})



router.delete('/delete/:id', IsAuthenticated, async (req, res) => {
    try {
        const { id } = req.params
        const del_user = await Request.findByIdAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            response: "Following request has been deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            response: "Someting went wrong"
        })
    }
})




export default router