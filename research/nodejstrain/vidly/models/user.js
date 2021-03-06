const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const mongoose = require('mongoose');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

//instance method of User
userSchema.methods.generateAuthToken = function() { 
  
  const token = jwt.sign(_.pick(this, ["_id","isAdmin","name"]), config.get('jwtPrivateKey'), {expiresIn:"1h"});
  //const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin,name:this.name }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

const complexityOptions = {
  min: 10,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 3,
}

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: new PasswordComplexity(complexityOptions),
    isAdmin:Joi.boolean()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;