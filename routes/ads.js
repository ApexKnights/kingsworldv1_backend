import express, { response } from "express"
import { IsAuthenticated } from "../auth/authenticate.js"
import { Ads } from "../models/Ads.js";
import { User } from "../models/User.js";



const router = express.Router()



router.post("/post-ads", IsAuthenticated, async (req, res) => {
    try {
        const { title, img, expire } = req.body;
        const postAd = await Ads.create({
            title,
            img,
            expire
        })
        res.status(201).json({
            success: true,
            response: "Ad has been successfully added",
            data: postAd
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})





router.get("/created-today", IsAuthenticated, async (req, res) => {
    try {
        // Get the current date and set the range for today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set to 12:00:00 AM

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set to 11:59:59 PM

        // Query to find ads created today
        const todaysAds = await Ads.find({
            createdAt: {
                $gte: startOfDay, // Greater than or equal to start of the day
                $lte: endOfDay,   // Less than or equal to end of the day
            },
        });

        res.status(200).json({
            success: true,
            message: "Ads created today fetched successfully",
            ads: todaysAds,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});



router.get('/get-all-ads', IsAuthenticated, async (req, res) => {
    try {
        const ads = await Ads.find();
        res.status(200).json({
            success: true,
            response: ads
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
})


// *******
router.put("/approve-ad/:id/:userId", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.params;
        const findUser = await User.findOne({ userId: userId })
        const findAd = await Ads.findById({ _id: id })

        const findapprove = await findAd.approvedby.find(e => e.userId === userId)

        if (findapprove) {
            res.status(500).json({
                success: false,
                response: "Sorry Ad already approved by user"
            })
        } else {
            const updateAd = await Ads.findOneAndUpdate({ _id: id }, {
                $push: {
                    approvedby: findUser.userId,


                }
            })
            const updateWallet = await findUser.updateOne({
                $inc: {
                    wallet: findUser.wallet2 * 0.2 / 100
                }
            })
            res.status(200).json({
                success: true,
                response: "Your Ad has been approved",
                updateAd,
                updateWallet
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            response: error.message
        })
    }
})



router.delete("/delete-ad/:id", IsAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        await Ads.findByIdAndDelete({ _id: id });
        res.status(200).json({
            success: true,
            response: "Following ad has been successsfully deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            response: error.message
        })
    }
})

router.get("/status/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Find ads approved by the user
        const approvedAds = await Ads.find({ approvedby: { $in: [userId] } });

        // Find ads NOT approved by the user
        const notApprovedAds = await Ads.find({ approvedby: { $nin: [userId] } });

        // Add approval date for approved ads
        const formattedApprovedAds = approvedAds.map((ad) => ({
            ...ad.toObject(),
            approvalDate: new Date(ad.updatedAt).toLocaleString(), // Assuming timestamps: true
        }));

        res.json({
            approved: formattedApprovedAds,
            notApproved: notApprovedAds,
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching ads" });
    }
});


export default router