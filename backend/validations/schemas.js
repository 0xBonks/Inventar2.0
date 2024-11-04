const Joi = require('joi');

const userSchemas = {
  register: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot be longer than 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('Admin', 'Manager')
      .default('Manager')
      .messages({
        'any.only': 'Role must be either Admin or Manager'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

const inventorySchemas = {
  create: Joi.object({
    name: Joi.string().required().min(2).max(100),
    quantity: Joi.number().integer().min(0).required(),
    location: Joi.string().required(),
    status: Joi.string().valid('In Stock', 'Low', 'Out')
  }),
  
  update: Joi.object({
    name: Joi.string().min(2).max(100),
    quantity: Joi.number().integer().min(0),
    location: Joi.string(),
    status: Joi.string().valid('In Stock', 'Low', 'Out')
  }).min(1)
};

module.exports = {
  userSchemas,
  inventorySchemas
}; 