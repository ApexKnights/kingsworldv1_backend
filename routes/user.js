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


router.get('/get-user/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const getoneuser = await User.findOne({ userId: userId });
        res.status(200).json({
            success: true,
            getoneuser
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


router.put('/ad-money-main/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { addmoney2 } = req.body
        const addWallet = await User.findOneAndUpdate({ userId: userId }, {
            $inc: {
                wallet2: addmoney2
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
// !Add Wallet Money

router.put('/remove-ad-money/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { addmoney } = req.body
        const addWallet = await User.findOneAndUpdate({ userId: userId }, {
            $inc: {
                wallet: -addmoney
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


router.put('/remove-ad-money-main/:userId', IsAuthenticated, async (req, res) => {
    try {
        const { userId } = req.params;
        const { addmoney2 } = req.body
        const addWallet = await User.findOneAndUpdate({ userId: userId }, {
            $inc: {
                wallet2: -addmoney2
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


router.get('/get-under-clients/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const finduser = await User.find({ under: userId });
        res.status(200).json({
            success: true,
            finduser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            err: error
        })
    }
})



const getUserNetworkAB = async (userId) => {
    const user = await User.findOne({ userId });

    if (!user) return null;

    // Fetch all users under this user
    const downlineUsers = await User.find({ under: userId });

    // Split downline into two groups: A and B
    const groupA = downlineUsers.slice(0, Math.ceil(downlineUsers.length / 2)); // First half
    const groupB = downlineUsers.slice(Math.ceil(downlineUsers.length / 2)); // Second half

    // Recursively get their downlines
    const downlineA = await Promise.all(groupA.map((u) => getUserNetworkAB(u.userId)));
    const downlineB = await Promise.all(groupB.map((u) => getUserNetworkAB(u.userId)));

    return {
        ...user.toObject(),
        A: downlineA, // Group A
        B: downlineB, // Group B
    };
};

// API route to get user network
router.get("/user-network/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const network = await getUserNetworkAB(userId);
        res.json(network);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



const getTotalMoneyAB = async (userId) => {
    const user = await User.findOne({ userId });

    if (!user) return { total: 0, A: 0, B: 0 };

    // Get all users under this user
    const downlineUsers = await User.find({ under: userId });

    // Split into A and B groups
    const groupA = downlineUsers.slice(0, Math.ceil(downlineUsers.length / 2));
    const groupB = downlineUsers.slice(Math.ceil(downlineUsers.length / 2));

    // Recursively calculate total money for Group A and Group B
    const A_total = await Promise.all(groupA.map((u) => getTotalMoneyAB(u.userId)));
    const B_total = await Promise.all(groupB.map((u) => getTotalMoneyAB(u.userId)));

    const A_money = A_total.reduce((sum, val) => sum + val.total, 0);
    const B_money = B_total.reduce((sum, val) => sum + val.total, 0);

    return {
        total: user.wallet2 + A_money + B_money,  // Total money including user + downlines
        A: A_money,  // Total money from Group A
        B: B_money   // Total money from Group B
    };
};
// API route to get total money in a user's network
router.get("/user-total-money/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const moneyData = await getTotalMoneyAB(userId);
        res.json({ userId, ...moneyData });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router