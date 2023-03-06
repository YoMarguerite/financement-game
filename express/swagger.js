const options = {
    swaggerDefinition: {
        info: {
            description: 'Here you can find the documentation of this microservice',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'https://voicerback.netlify.app/.netlify/functions/server',
        basePath: '/v1',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['server.js'] //Path to the API handle folder
};

module.exports = { options };