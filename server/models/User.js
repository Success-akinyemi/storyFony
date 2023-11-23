import crypto from 'crypto'
import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'

export const UserSchema = new mongoose.Schema({
    fisrtName: {
        type: String,
        required: [true, 'Please Provide a Fisrt Name']
    },
    lastName: {
        type: String,
        required: [true, 'Please Provide a Last Name']
    },
    email: {
        type: String,
        required: [true, 'Please Provide an Email' ],
        unique: [true, 'Email Already Exist Please use another']
    },
    penName: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please Provide a Password']
    },
    profileImg: {
        type: String
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
    totalCreditUsed:{
        type: Number,
        default: 0
    },
    totalCreditEverUsed: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
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