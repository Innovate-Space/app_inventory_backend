const { google_sign_in, normal_sign_in, create_account } = require('./auth_ctrl');
const {all_products, create_products} = require('./product_ctrl');
module.exports = {
    create_account,
    normal_sign_in,
    all_products,
    create_products
}