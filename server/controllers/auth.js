import UserModel from "../models/User.js"
import Mailgen from 'mailgen'
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto'
import TokenModel from "../models/Tokens.js";
import SubscribersModel from "../models/NewsletterSubscribers.js.js";
import jwt from 'jsonwebtoken'
import { stripe } from "../utils/stripe.js";

const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: `${process.env.MAIL_WEBSITE_NAME}`,
        link: `${process.env.MAIL_WEBSITE_LINK}`
    }
})


export async function register (req, res, next){
    const { fisrtName, lastName, email, penName, password } = req.body
    console.log(fisrtName, lastName, email, penName ,password)

    if(!fisrtName || !lastName || !email || !password ){
        return res.status(400).json({ success: false, data: 'please provide all required fields'})
    }

    try {
        const existingEmail = await UserModel.findOne({ email });
        if(existingEmail){
            return res.status(400).json({ success: false, data: 'Email Alreay exists. Please use another email'})
        }

        const user = await UserModel.create({
            name: `${fisrtName} ${lastName}`, penName, email, password
        })
        console.log('USER CREATED')

        const token = await new TokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
        }).save()

        const verifyUrl = `${process.env.MAIL_WEBSITE_LINK}/${user._id}/verify/${token.token}`

        try {
            // send mail
            const emailContent = {
                body: {
                    intro: 'SIGNUP SUCCESSFUL, PLEASE VERIFY EMAIL',
                    action: {
                        instructions: `You Have Successfull Signup to Story Fony, Please Click on the Button Below to verify your Email Address. Note Email is Valid for One (1) Hour.`,
                        button: {
                            color: '#33b5e5',
                            text: 'Verify Your Email',
                            link: verifyUrl
                        },
                    },
                    outro: `
                        If you cannot click the reset button, copy and paste the url here in your browser ${verifyUrl}

                        If you did not SignUp to Story Fony, please ignore this email and report.
                    `
                },
            };

            const emailTemplate = mailGenerator.generate(emailContent)
            const emailText = mailGenerator.generatePlaintext(emailContent)
            
            await sendEmail({
                to: user.email,
                subject: 'StoryGenerator Verify Your Email',
                text: emailTemplate
            })

            return res.status(200).json({success: true, data: `Verification Email Sent to ${email}`})
        } catch (error) {
            console.log('ERROR SENDING VERIFY EMAIL', error)
            return res.status(500).json({ success: false, data: 'Email could not be sent'})
        }
        
        //sendToken(user, 201, res)
        //res.status(200).json({success: true, data: `Signup Successful Please Verify email sent to ${email}`})
    } catch (error) {
        console.log('ERROR REGISTERING USER', error)
        res.status(500).json({ success: false, data: 'Could Not Regiater User'})
    }
}

export async function verifyNewUser(req, res, next){
    const { id } = req.params
    const { token } = req.params
    console.log('PARAMS ID', id)
    console.log('TOKEN', token)
    try {
        const user = await UserModel.findById({ _id: id})
        if(!user){
            return res.status(400).json({ success: false, data: 'Invalid User'})
        }

        const token = await TokenModel.findOne({
            userId: user._id,
            token: req.params.token
        })

        if(!token){
            return res.status(400).json({ success: false, data: 'Invalid Link'})
        }
        const userEmail = user.email
        const customer = await stripe.customers.create({
            email: userEmail
        }, {
            apiKey: process.env.STRIPE_SK
        })

        

        //await UserModel.updateOne({ _id: user._id, verified: true})
        user.verified = true;
        user.stripeCustomersId = customer.id
        await user.save()
        
        await TokenModel.deleteOne({ _id: token._id })

        const authToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
        const expiryDate = new Date(Date.now() + 360000)
        res.cookie('fonyAccessToken', authToken, { expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: user })
    } catch (error) {
        console.log('COULD NOT VERIFY USER', error)
        res.status(500).json({ success: false, data: error.message})        
    }
}

export async function login (req, res, next){
    const { email, password } = req.body;
    console.log(email, password)

    if(!email || !password){
        return res.status(401).json({ success: false, data: 'Please provide an email and password'})
    }

    try {
        const user = await UserModel.findOne({ email }).select('+password');
        
        if(!user){
            return res.status(401).json({ success: false, data: 'Invalid User'})
        }

        const isMatch = await user.matchPasswords(password);

        if(!isMatch){
            return res.status(401).json({ success: false, data: 'Invalid Password'})
        }

        if(!user.verified){
            console.log('working')
            let token = await TokenModel.findOne({ userId: user._id})
            if(!token){
                const token = await new TokenModel({
                    userId: user._id,
                    token: crypto.randomBytes(32).toString('hex')
                }).save()
        
                const verifyUrl = `${process.env.MAIL_WEBSITE_LINK}/${user._id}/verify/${token.token}`
        
                try {
                    // send mail
                    const emailContent = {
                        body: {
                            intro: 'PLEASE VERIFY EMAIL',
                            action: {
                                instructions: `Your Story Fony Account is not yet valid, Please Click on the Button Below to verify your Email Address. Note Email is Valid for One (1) Hour.`,
                                button: {
                                    color: '#33b5e5',
                                    text: 'Verify Your Email',
                                    link: verifyUrl
                                },
                            },
                            outro: `
                                If you cannot click the reset button, copy and paste the url here in your browser ${verifyUrl}
        
                                If you did not SignUp to Story Fony, please ignore this email and report.
                            `
                        },
                    };
        
                    const emailTemplate = mailGenerator.generate(emailContent)
                    const emailText = mailGenerator.generatePlaintext(emailContent)
                    
                    await sendEmail({
                        to: user.email,
                        subject: 'Verify Your Email',
                        text: emailTemplate
                    })
        
                    return res.status(200).json({success: true, isVerified: false , data: `Verification Email Sent. Check your email address and verify your account`})
                } catch (error) {
                    console.log('ERROR SENDING VERIFY EMAIL', error)
                    return res.status(500).json({ success: false, data: 'Email could not be sent'})
                }
            } else{
                return res.status(200).json({ success: false, isVerified: false, data: 'Account Not Verified. An Email Has been sent to You Please Verify Account'})
            }
        }

        console.log('USER', user)
        const authToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET)
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '12h' })
        const expiryDate = new Date(Date.now() + 43200000)
        const { password: userPassword, adminPassword, ...userData} = user._doc
        res.cookie('fonyAccessToken', authToken, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData, token: token })
    } catch (error) {
        console.log('ERROR LOGGING USER', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function google(req, res){
    const { name, email, photo } = req.body
    console.log('O Auth ', req.body)
    try {
        const user = await UserModel.findOne({ email: email })
        if(user){
            const authToken = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' })
            const { password: hashedPassword, ...userData } = user._doc
            const expiryDate = new Date(Date.now() + 3600000)
            res.cookie('fonyAccessToken', authToken, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData, token: token })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            //const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const customer = await stripe.customers.create({
                email: userEmail
            }, {
                apiKey: process.env.STRIPE_SK
            })
            const newUser = await UserModel.create({
                name: name,
                email: email,
                password: generatedPassword,
                profileImg: photo,
                penName: 'Awesome Writter',
                stripeCustomersId: customer.id
            })
            
            const authToken = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET)
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const { password: hashedPassword2, adminPassword, ...userData } = newUser._doc
            const expiryDate = new Date(Date.now() + 3600000)
            res.cookie('fonyAccessToken', authToken, { httpOnly: true, expires: expiryDate, sameSite: 'None', secure: true}).status(201).json({ success: true, data: userData, token: token })
        }
    } catch (error) {
        console.log('ERROR SINGIN USER WITH GOOGLE', error)
        res.status(500).json({ success: false, data: 'Could not signin user'})
    }
}

export async function forgotPassword (req, res, next){
    const { email} = req.body

    try {
        const user = await UserModel.findOne({ email });

        if(!user){
            return res.status(404).json({ success: false, data: 'Email Does Not Exist'})
        }

        const resetToken = user.getResetPasswordToken()

        await user.save()

        const resetUrl = `${process.env.MAIL_WEBSITE_LINK}/newPassword/${resetToken}`

        try {
            // send mail
            const emailContent = {
                body: {
                    intro: 'You have Requested a password reset.',
                    action: {
                        instructions: 'Please click the following button to reset your password. Link Expires in 10 mintues',
                        button: {
                            color: '#33b5e5',
                            text: 'Reset Your Password',
                            link: resetUrl
                        },
                    },
                    outro: `
                        If you cannot click the reset button, copy and paste the url here in your browser ${resetUrl}

                        If you did not request this reset, please ignore this email.
                    `
                },
            };

            const emailTemplate = mailGenerator.generate(emailContent)
            const emailText = mailGenerator.generatePlaintext(emailContent)
            
            await sendEmail({
                to: user.email,
                subject: 'Password Reset Request',
                text: emailTemplate
            })

            res.status(200).json({success: true, msg: 'Email sent', data: email })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined

            await user.save()
            return res.status(500).json({ success: false, data: 'Email could not be sent' })
        }
    } catch (error) {
        console.log('ERROR GENERATING RESET LINK', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function resetPassword (req, res, next){
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')

    try {
        const user = await UserModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })

        if(!user){
            return  res.status(400).json({ success: false, data: 'Invalid Reset Token'})
        }

        user.password = req.body.password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined

        await user.save();

        res.status(201).json({
            success: true,
            data: 'Password Reset success'
        })
    } catch (error) {
        console.log('ERROR RESETING USER PASSWORD', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function getUser (req, res){
    const { id } = req.params;

    try {
        const user = await UserModel.findById({ _id: id})
        if(!user){
            return res.status(404).json({ success: false, data: 'Cannot find user'});
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log('CAN NOT GET A USER', error)
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function subscriber(req, res){
    const { email } = req.body

    try {
        if(!email){
            return res.status(400).json({ success: false, data: 'Invalid Email'})
        }
        const isExist = await SubscribersModel.findOne({ email: email})

        if(isExist){
            return res.status(400).json({ success: false, data: 'Email Already Exist'})
        }

        const subscribe = await new SubscribersModel({ email }).save()
        res.status(201).json({success: true, data: 'Email Added To subscription List'})
    } catch (error) {
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function getAllSubscriber(req, res){
    const { id } = req.params
    try {
        const isAdmin = await UserModel.findById({ _id: id })

        if(!isAdmin.isAdmin){
            return res.status(404).json({ success: true, data: 'NOT ALLOWED'})
        }
        const subscribers = await  SubscribersModel.find()

        res.status(200).json({success: true, data: subscribers})
    } catch (error) {
        res.status(500).json({ success: false, data: error.message})
    }
}

export async function signout(req, res){
    res.clearCookie('accessToken').status(200).json({success: true, data: 'Signout success'})
}


//User
export async function updateUser(req, res){
    console.log('updateUser', req.params.id)
    if(req.user.id !== req.params.id){
        return res.status(401).json({ success: false, data: 'You can only update you Account'})
    }
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }


        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    penName: req.body.penName,
                    profileImg: req.body.profileImg,
                    country: req.body.country,
                    state: req.body.state,
                    occupation: req.body.occupation,
                }
            },
            { new: true }
        );

        const { password, adminPassword, ...userData} = updatedUser._doc

        res.status(200).json({ success: true, data: userData })
    } catch (error) {
        console.log('ERROR UPDATING USER', error)
        res.status(500).json({ success: false, data: 'Failed to upload user'})
    }
} 

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({success: true, token, isVerified: true,})
}
