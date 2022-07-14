const { validationResult } = require('express-validator');
const createHttpError = require('http-errors');
const { Sequelize } = require('sequelize');
const db = require('../models/index');
const UserException = require('../exceptions/user_error');
const ProductException = require('../exceptions/product_error');

exports.all_products= async (req, res, next) => {
    try{
        const email = req.email;
        const products = await db.sequelize.models.Products.getAllProducts(email);
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
        console.log(req.email);
        const errors = validationResult(req);
        if(!errors.isEmpty() ){
            console.log(errors);
            return next(createHttpError(422,errors.array()[0].msg));
        }
        const product = await db.sequelize.models.Products.createProduct(productName, price,shortDescription, req.email);
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

exports.delete_product = async (req, res, next) => {
    try{
        const productId = req.params.id;
        const product = await db.sequelize.models.Products.deleteProduct(productId, req.email);
        res.json({product, message: 'Deleted product'})
    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else{
            console.log(e);
            next(e);
        }
    }
}

exports.edit_product = async (req, res, next) => {
    try{
        const productId = req.params.id;
        const {productName, price, shortDescription} = req.body;
        console.log(req.email);
        const errors = validationResult(req);
        if(!errors.isEmpty() ){
            console.log(errors);
            return next(createHttpError(422,errors.array()[0].msg));
        }
        const product = await db.sequelize.models.Products.editProduct(productName, price, shortDescription, productId, req.email);
        res.json({product, message: 'Updated successfully'})
    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else{
            console.log(e);
            next(e);
        }
    }
}

exports.get_product = async (req, res, next) => {
    try{
        const productId = req.params.id;
        const product = await db.sequelize.models.Products.getSingleProduct(productId, req.email);
        if(product){
            res.json({product, message: 'Product retrieved'});
        }else{
            res.status(404).json({message: 'Product Not found'})
        }

    }catch(e){
        if (e instanceof Sequelize.ValidationError){
            next(createHttpError(500, e.message || "Error encountered while dumping into the db"))
        }else{
            console.log(e);
            next(e);
        }
    }
}