import UserModel from "../models/User.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import SubscriptionModel from "../models/Subscription.js";
import moment from 'moment';

export async function makeAdmin (req, res, next){
    const { userId } = req.body
    console.log(userId)

    if(!userId ){
        return res.status(400).json({ success: false, data: 'please provide user Id'})
    }

    try {
        const existingEmail = await UserModel.findById({ _id: userId });
        if(!existingEmail){
            return res.status(400).json({ success: false, data: 'User does not Exist'})
        }
        existingEmail.isAdmin = true
        const hashedPassword = bcryptjs.hashSync(`${process.env.ADMIN_PASSCODE}`, 10)
        existingEmail.adminPassword = hashedPassword
        await existingEmail.save()
        console.log('USER UPDATED', existingEmail)

        res.status(201).json({ success: true, data: 'User Updated'})
    } catch (error) {
        console.log('ERROR REGISTERING USER', error)
        res.status(500).json({ success: false, data: 'Could Not update User'})
    }
}

export async function removeAdmin (req, res, next){
    const { userId } = req.body
    console.log(userId)

    if(!userId ){
        return res.status(400).json({ success: false, data: 'please provide user Id'})
    }

    try {
        const existingEmail = await UserModel.findById({ _id: userId });
        if(!existingEmail){
            return res.status(400).json({ success: false, data: 'User does not Exist'})
        }
        existingEmail.isAdmin = false
        existingEmail.adminPassword = ''
        await existingEmail.save()
        console.log('USER UPDATED', existingEmail)

        res.status(201).json({ success: true, data: 'User Updated'})
    } catch (error) {
        console.log('ERROR REGISTERING USER', error)
        res.status(500).json({ success: false, data: 'Could Not update User'})
    }
}

export async function login (req, res, next){
    const { email, password, passcode } = req.body;
    console.log(email, password, passcode)

    if(!email || !password || !passcode){
        return res.status(404).json({ success: false, data: 'Please provide all information'})
    }

    try {
        const user = await UserModel.findOne({ email }).select('+password');

        if(!user){
            return res.status(404).json({ success: false, data: 'Invalid User'})
        }
        
        if(!user.isAdmin){
            return res.status(403).json({ success: false, data: 'Not Allowed'})
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            return res.status(400).json({ success: false, data: 'Invalid Password'})
        }

        const validPassword = bcryptjs.compareSync(passcode, user.adminPassword)
        if(!validPassword){
            return res.status(400).json({ success: false, data: 'Invalid passcode'})
        }

        console.log('USER', user)
        const authToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '12h' })
        const expiryDate = new Date(Date.now() + 43200000)
        const { password: userPassword, adminPassword, grandAdmin, ...userData} = user._doc
        res.cookie('adminfonyAccessToken', authToken, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData, token: token })
    } catch (error) {
        console.log('ERROR LOGGING ADMIN USER', error)
        res.status(500).json({ success: false, data: 'Server Error'})
    }
}

export async function getAllsubscriptions(req, res){
    try {
        const allSubs = await SubscriptionModel.find();
        
        // Fetch user details for each subscription and create new objects
        const subsWithUserDetails = await Promise.all(allSubs.map(async (sub) => {
            const userId = sub.userId;
            const user = await UserModel.findById(userId);
            
            // Create a new object with the user details added
            return {
                ...sub.toObject(), // Convert to plain JavaScript object
                name: user.name,
                profileImg: user.profileImg
            };
        }));

        // Calculate total subscription amount and count for this month
        const thisMonthStartDate = moment().startOf('month').toDate();
        const thisMonthEndDate = moment().endOf('month').toDate();
        const subsThisMonth = subsWithUserDetails.filter(sub => 
            moment(sub.createdAt).isBetween(thisMonthStartDate, thisMonthEndDate)
        );
        const thisMonthAmount = subsThisMonth.reduce((total, sub) => total + sub.amount, 0);
        const thisMonthTotal = subsThisMonth.length;

        // Calculate total subscription amount and count for last month
        const lastMonthStartDate = moment().subtract(1, 'month').startOf('month').toDate();
        const lastMonthEndDate = moment().subtract(1, 'month').endOf('month').toDate();
        const subsLastMonth = subsWithUserDetails.filter(sub => 
            moment(sub.createdAt).isBetween(lastMonthStartDate, lastMonthEndDate)
        );
        const lastMonthAmount = subsLastMonth.reduce((total, sub) => total + sub.amount, 0);
        const lastMonthTotal = subsLastMonth.length;

        // Calculate percentage increase or decrease for amount and total
        let percentageAmount;
        if (lastMonthAmount === 0) {
            percentageAmount = 100; // Set to 100% if there are no subscriptions last month
        } else {
            percentageAmount = ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
        }
        const percentageTotal = lastMonthTotal === 0 ? 100 : ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

        console.log('firstLLL', subsWithUserDetails);
        res.status(200).json({ 
            success: true, 
            data: subsWithUserDetails, 
            thisMonthAmount, 
            percentageAmount, 
            thisMonthTotal, 
            percentageTotal 
        });
    } catch (error) {
        console.log('ERROR GET ALL SUBSCRIPTIONS', error);
        res.status(500).json({ success: false, data: 'Failed to get all subscriptions' });
    }
}

export async function getUsers(req, res){
    try {
        const userData = await UserModel.find();

        const thisMonthStartDate = moment().startOf('month').toDate();
        const thisMonthEndDate = moment().endOf('month').toDate();
        const lastMonthStartDate = moment().subtract(1, 'month').startOf('month').toDate();
        const lastMonthEndDate = moment().subtract(1, 'month').endOf('month').toDate();

        // Get users for this month
        const usersThisMonth = userData.filter(user => 
            moment(user.createdAt).isBetween(thisMonthStartDate, thisMonthEndDate)
        );

        // Get users for last month
        const usersLastMonth = userData.filter(user => 
            moment(user.createdAt).isBetween(lastMonthStartDate, lastMonthEndDate)
        );

        // Calculate percentage increase or decrease
        let percentageChange;
        if (usersLastMonth.length > 0) {
            percentageChange = ((usersThisMonth.length - usersLastMonth.length) / usersLastMonth.length) * 100;
        } else {
            percentageChange = 100; // If there are no users last month, consider the change as 100%
        }

        res.status(200).json({ 
            success: true, 
            data: userData, 
            thisMonth: usersThisMonth.length, 
            percentage: percentageChange 
        });
    } catch (error) {
        console.log('Unable to get Users', error);
        res.status(500).json({ success: false, data: 'Unable to get users'});
    }
}
export async function getUser(req, res){
    const { id } = req.params
    try {
        const userData = await UserModel.findById({ _id: id})

        if(!userData){
            return res.status(404).json({ success: false, data: 'No user found'})
        }

        res.status(200).json({ success: true, data: userData})
    } catch (error) {
        console.log('Unable to get User', error)
        res.status(500).json({ success: false, data: 'Unable to get user'})
    }
}