import express, { response } from "express"
import { IsAuthenticated } from "../auth/authenticate.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt"

const router = express.Router();


router.get('/get-users', IsAuthenticated, async (req, res) => {
    try {
        const allusers = await User.find();
        res.status(200).json({
            success: true,
            response: allusers
        })
    } catch (error) {
        res.status(500)._construct.json({
            success: false,
            err: error,
        })
    }
})



router.put('/edit-profile/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, mobile, email } = req.body;

        const edit_user = await User.findOneAndUpdate({ userId: userId }, {
            $set: {
                username,
                mobile,
                email
            }
        }, { new: true })

        res.status(200).json({
            success: true,
            message: "Your Profile has been successfully updated",
            response: edit_user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})


router.put('/edit-password/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const encryptedpassword = await bcrypt.hashSync(password, salt);

        const edit_user_password = await User.findOneAndUpdate({ userId: userId }, {
            $set: {
                password: encryptedpassword
            }
        }, { new: true })

        res.status(200).json({
            success: true,
            message: "Your Profile password has been successfully updated",
            response: edit_user_password,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})


router.delete('/delete-user/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;

        const del_user = await User.findOneAndDelete({ userId: userId });
        res.status(200).json({
            success: true,
            response: "User Has been successfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})


// * Add Wallet Money

router.put('/ad-money/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { addmoney } = req.body
        const addWallet = await User.findOneAndUpdate({ userId: userId }, {
            $inc: {
                wallet: addmoney
            }
        })
        res.status(200).json({
            success: true,
            response: "Member wallet has been updated",
            addWallet
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})



export default router