const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const _ = require('lodash');

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

  class User{
      
  }
  
  
  exports.validate = validateUser;