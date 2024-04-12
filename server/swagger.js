
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for my API',
        },
    },
    apis: ['./routes/*.js'], // spécifiez ici les chemins vers vos fichiers de routes
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
