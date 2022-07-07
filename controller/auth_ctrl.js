const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const { Sequelize } = require('sequelize');
const models = require('../models/index');
const UserException = require('../exceptions/user_error');


exports.normal_sign_in = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty() ){
            console.log(errors);
            return next(createHttpError(422,errors.array()[0].msg));
        }
        console.log(models.sequelize.models.User);
        const user = await models.sequelize.models.User.normalSignIn(email, password);
        const jwtToken = user.generateJwt();
        const response = {
            message: "Login was successful",
            jwt_token: jwtToken,
            api_auth_user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phone_number: user.phone_number,
            }
        }
        res.status(200).json(response);

    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else if(e instanceof UserException){
            next(createHttpError(401, e.message || "Error or issue with the authenticated user"))
        }else{
            console.log(e);
            next(e);
        }
    }
}


/**
 * 
 * @param {*} req node js request object
 * @param {*} res node js response object
 * @param {*} next  node js next middle ware caller
 * @description API endpoint to create a new  user account
 */
 exports.create_account = async(req, res, next) => {
    
    try{
        const {email, fullName, phoneNumber, password, } = req.body;

        const errors = validationResult(req);
        if(!errors.isEmpty() ){
            return next(createHttpError(422,errors.array()[0].msg));
        }


        const user =await models.sequelize.models.User.createAccount(fullName,email,password);
        const jwtToken = user.generateJwt();
        if(!user.is_verified_email){
            
        }
        const response = {
            message: "Account was successfully created",
            jwt_token: jwtToken,
            is_google_auth: false,
            has_verified_phone_number: user.is_verified_phone,
            has_verified_email: user.is_verified_email,
            api_auth_user: {
                id: user.id,
                email: user.email,
                full_name: user.fullName,
                phoneNumber: user.phoneNumber,
            }
        }
        
        res.status(201).json(response);
    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else if(e instanceof UserException){
            next(createHttpError(409, e.message || "Error or issue with the authenticated user"))
        }else{
            console.log(e);
            next(e);
        }
        
    }
}