const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');

module.exports = jwtTokenVerify = async (req, res,  next) => {
    try{
        if(!req.headers['authorization']){
           return next(createHttpError(400, "Request is missing jwt Headers"))
        }
        const authHeader = req.headers['authorization'].split(' ')[1];
        const decoded = jwt.verify(authHeader, process.env.JWT_SECRET, {expiresIn: '20m'});
        req.email = decoded.email;
        next();

    }catch(e){
        next(e);
    }
}