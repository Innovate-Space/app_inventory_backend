const express = require('express');
const { body } = require('express-validator');
const c = require('../controller/controller');
const methodNotAllowed = require('../middleware/blocked_verbs');
const jwtTokenVerify = require('../middleware/token_verifier');
const router = express.Router();

router.route('/products').get(jwtTokenVerify, c.all_products).all(methodNotAllowed);

router.route('/add').post(
    body('price').isNumeric(),
    jwtTokenVerify,
    c.create_products
).all(methodNotAllowed);

module.exports = router;