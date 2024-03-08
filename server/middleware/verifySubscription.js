import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

export const verifyToken = (req, res, next) => {
    const token = req.cookies.fonyAccessToken
    console.log('TOKEN>>', token)

    if(!token) return res.status(401).json({ success: false, data: 'Not Allowed Please Login'})

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({ success: false, data: 'User Forbidden Please Login'})
    
        req.user = user;
        next();
    });
}

export const expiredSub = (req, res, next) => {
    verifyToken(req, res, () => {
        const exipryDate = req.user.planEndDate
        const currentDate = new Date()
        if(exipryDate > currentDate){
            return res.status(420).json({ success: false, data: 'Subscription expired please update your subscription'})
        } else {
            next()
        }
    })
}

export const basicSub = () => {}

export const standardSub = (req, res, next) => {
    verifyToken(req, res, () => {
        const isBasicUser = req.user.planName
        if(isBasicUser === 'basic'){
            return res.status(406).json({ success: false, data: 'Upgrade to Standard to Continue.'})
        } else{
            next()
        }
    })
}

export const premiumSub = async (req, res, next) => {
    verifyToken(req, res, async () => {
        console.log('user', req.user.id)
        const user = await UserModel.findById({ _id: req.user.id })
        const isPremiun = user.planName
        if(isPremiun === 'premium'){
            console.log('GOOD TO GO')
            next ()
        } else {
            console.log('NOPE UPDATE SUB')
            return res.status(406).json({ success: false, data: 'Upgrade to Premium Subscrption to continue'})
        }
    })
}