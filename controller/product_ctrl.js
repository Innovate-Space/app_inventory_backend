const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const { Sequelize } = require('sequelize');
const db = require('../models/index');
const UserException = require('../exceptions/user_error');
const ProductException = require('../exceptions/product_error');

exports.all_products= async (req, res, next) => {
    try{
        const products = await db.sequelize.models.Products.getAllProducts();
        res.status(200).json(products);
    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else if(e instanceof ProductException){
            res.status(404).json({"message": e.message})
        }else{
            console.log(e);
            next(e);
        }
    }
}

exports.create_products= async (req, res, next) => {
    try{
        const {productName, price, shortDescription} = req.body;
        const errors = validationResult(req);
        if(!errors.isEmpty() ){
            console.log(errors);
            return next(createHttpError(422,errors.array()[0].msg));
        }
        const product = await db.sequelize.models.Products.createProduct(productName, price,shortDescription);
        const response = {
            message: "Product Created successfully",
            product: product
        }
        res.status(200).json({
            products: response,
            message: 'Successfully retrieved'
        });

    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else{
            console.log(e);
            next(e);
        }
    }
}