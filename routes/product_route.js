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

router.route('/edit/:id').put(
    body('price').isNumeric(),
    jwtTokenVerify,
    c.edit_product
).all(methodNotAllowed)

router.route('/remove/:id').delete(jwtTokenVerify, c.delete_product).all(methodNotAllowed);

router.route('/product/:id').get(jwtTokenVerify, c.get_product).all(methodNotAllowed);

module.exports = router;