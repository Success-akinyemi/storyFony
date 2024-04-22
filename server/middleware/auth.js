import jwt from "jsonwebtoken"
import OpenAI from 'openai'
import ApiKeyModel from "../models/ApiKey.js"

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

export const verifyApiKey = async (req, res, next) => {
    verifyToken(req, res, async () => {
        const id = req.user.id
        const findkey = await ApiKeyModel.findOne({ userId: id })
        const key = findkey?.key
        if(!findkey && !key){
            return res.status(404).json({ success: false, data: 'Please add your openai api key in profile page'})
        }
        const openai = new OpenAI({ apiKey: key });

        req.openai = openai
        if(req.user.id){
            next()
        } else {
            return res.status(403).json({ success: false, data: 'You are Forbidden'})
        }
    })
}

export const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.adminfonyAccessToken
    console.log('ADMIN TOK',token)

    if(!token) return res.status(401).json({ success: false, data: 'Not Allowed Please Login'})

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({ success: false, data: 'User Forbidden Please Login'})
    
        req.user = user;
        next();
    });
}


export const verifyTokenAndAdmin = (req, res, next) => {
    verifyAdminToken(req, res, () => {
        if(req.user.isAdmin){
            next()
        } else {
            return res.status(403).json({ success: false, data: 'You are Forbidden'})
        }
    })
}

export const verifyTokenAndGrandAdmin = (req, res, next) => {
    verifyAdminToken(req, res, () => {
        if(req.user.grandAdmin){
            next()
        } else {
            return res.status(403).json({ success: false, data: 'You are Forbidden'})
        }
    })
}