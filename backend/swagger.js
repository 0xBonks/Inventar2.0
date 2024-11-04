const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '1.0.0',
      description: 'API documentation for Inventory Management System'
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsDoc(options);

module.exports = { specs, swaggerUi }; 