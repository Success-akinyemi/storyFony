import jwt from "jsonwebtoken"

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