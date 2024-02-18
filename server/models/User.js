import crypto from 'crypto'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

export const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide a Name']
    },
    email: {
        type: String,
        required: [true, 'Please Provide an Email' ],
        unique: [true, 'Email Already Exist Please use another']
    },
    penName: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    occupation: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password']
    },
    adminPassword: {
        type: String
    },
    profileImg: {
        type: String,
        default: 'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    totalCredit: {
        type: Number,
        default: 4000
    },
    totalCreditBalance: {
        type: Number,
        default: 4000,
    },
    totalCreditUsed:{
        type: Number,
        default: 0
    },
    totalCreditEverUsed: {
        type: Number,
        default: 0
    },
    stripeCustomersId: {
        type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    planId: {
        type: String,
    },
    planName: {
        type: String
    },
    planStartDate: {
        type: Number
    },
    planEndDate: {
        type: Number
    },
    planAmount: {
        type: Number
    },
    planCurrency: {
        type: String
    },
    planStatus: {
        type: String
    }
},
{timestamps: true}
);

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    };

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }

})

UserSchema.methods.matchPasswords = async function(password){
    return await bcryptjs.compare(password, this.password)
}


UserSchema.methods.getSignedToken = function(){
    return jsonwebtoken.sign({ id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

UserSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

    return resetToken
}

const UserModel =  mongoose.model('storyGenertorUsers', UserSchema);
export default UserModel