import jsonwebtoken from 'jsonwebtoken'
import UserModel from '../models/User.js'
import ErrorResponse from '../utils/errorResponse.js';

export default async function Protect(req, res, next){
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if(!token){
        return next(new ErrorResponse('Not Authorized to access this route', 401))
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded.id)

        if(!user){
            return next(new ErrorResponse('No User Found with this ID', 404))
        }

        req.user = user
        next()
    } catch (error) {
        return next(new ErrorResponse('Not Authorized to access this routes', 401))
    }
}