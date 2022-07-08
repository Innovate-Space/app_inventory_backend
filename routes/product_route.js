const express = require('express');
const { body } = require('express-validator');
const c = require('../controller/controller');
const router = express.Router();

router.route('/products').get(c.all_products).all()

router.route('/add').post(
    body('price').isNumeric(),
    c.create_products
).all()

module.exports = router;