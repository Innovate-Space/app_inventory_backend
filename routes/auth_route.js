const express = require('express');
const { body } = require('express-validator');
const c = require('../controller/controller');
const router = express.Router();

router.route('/create-account').post(
    body('email').isEmail().withMessage("Please provide a valid email address"),
    body('password').matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").withMessage("Password should contain an uppercase letter"),
    body('fullName').isLength({min: 2}).trim().escape(),
    c.create_account
).all()

router.route('/login').post(
    body('email').isEmail().withMessage("Please provide a valid email address"),
    body('password').matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$").withMessage("Password should contain an uppercase letter"),
    c.normal_sign_in
).all()

module.exports = router;