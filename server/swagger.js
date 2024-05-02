const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'Your API Description',
        },
    },
    apis: ['./routes/*.js'], // Specify the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
