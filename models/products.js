'use strict';
const {
  Model
} = require('sequelize');
const ProductException = require('../exceptions/product_error');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async getAllProducts(email){
      let products = await Products.findAll({where:{email}});
      if((products != null || products!= undefined) && products.length != 0 ){
        return products;
      }else{
        throw new ProductException("No product was found")
      }

    }

    static async createProduct(product_name, price, description, email) {
      const product = await Products.create({product_name, price, description , email});
      return product;
    }

    static async deleteProduct(id, email){
      const product =  await Products.destroy({where: {id, email}})
      return product
    }

    static async getSingleProduct(id, email){
      const product =  await Products.findOne({where: {id, email}})
      return product
    }

    static async editProduct(product_name, price, description, id, email){
      const data = {product_name, price, description};
      const product = await Products.update(data, {where: {id, email}});
      return product;
    }
  }
  Products.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    product_name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    email: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};