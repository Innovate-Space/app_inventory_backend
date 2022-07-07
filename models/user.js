'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserException = require('../exceptions/user_error');

const saltRounds = 12;

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    /**
      * @param {*} plainPassword is the plain password to be compared
      * @returns a boolean value to indicate if the token is  valid.
      */
     async isValidPassword(plainPassword){
      const doesMatch = await bcrypt.compare(plainPassword, this.password);
      return doesMatch;
    }

    /**
      * @returns A JWT TOKEN STRING. EACH GENERATED TOKEN IS ONLY VALID FOR 20 MINUTES
      */
    generateJwt(){
      //A short lived jwt token that is only valid for 20 minutes 
      //const expiry = new Date();
      //expiry.setMinutes(expiry.getMinutes() + 20);
      return jwt.sign({
        email: this.email,
      }, process.env.JWT_SECRET, {expiresIn: '20m'});
    }

    /**
    * @description throws UserException is the user does not exist or have a valid password
    * @param {*} email address
    * @param {*} plainPassword  is a plain password
    * @param {*} access_token  is the access token used for refreshing jwt
    * @returns returns an instance of user
    */
    static async normalSignIn(email, plainPassword){
      const user = await User.findOne({where: {email: email}});
      if(user){
        if( await user.isValidPassword(plainPassword)){
          return user;
        }else{
          throw new UserException('Either email or password is not valid!');
        }
      }else{
        throw new UserException('User not found!');
      }
    }

    /**
      * @description throws UserException if an email already exists with that information
      * @param {*} full_name Account owner name
      * @param {*} email address
      * @param {*} phone_number Account owner phone number
      * @param {*} password Account owner password
      * @param {*} access_token access_token access token used to refresh jwt
      * @returns returns an instance of user
      */
     static async createAccount(fullName, email, password) {
      let user = await User.findOne({where:{email}});
      if(!user){
        user = await User.create({email, fullName, password });
        return user;
      }else{
        throw new UserException('Email Address already exists!');
      }
    }
  }
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    fullName: DataTypes.STRING,
    email: {
      type :  DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail: true
      }
    },
    password:{
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(hashPasswordHook);
  User.afterUpdate(hashPasswordHook);
  return User;
};

const hashPasswordHook = function(instance, options) {
  if (!instance.changed('password')) return ;
  return new Promise(function (resolve, reject) {
      bcrypt.hash(instance.password, saltRounds, function (err, hashedPassword) {
        if (err) reject(err)
        else resolve(hashedPassword)
      })
    }).then(function (hashedPassword) {
      instance.password = hashedPassword
    })
};