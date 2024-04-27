import UserModel from "../models/User.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import SubscriptionModel from "../models/Subscription.js";


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
        const allSubs = await SubscriptionModel.find()
        console.log('firstLLL')

        res.status(200).json({ success: true, data: allSubs})
    } catch (error) {
        console.log('ERROR GET ALL SUBSCRIPTIONS', error)
        res.status(500).json({ success: false, data: 'Failed to get all subcriptions'})
    }
}

export async function getUsers(req, res){
    try {
        
    } catch (error) {
        
    }
}

export async function getUser(req, res){
    try {
        
    } catch (error) {
        
    }
}