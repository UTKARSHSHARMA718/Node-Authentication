import swaggerAutogen from 'swagger-autogen';
import dotevn from 'dotenv'
dotevn.config();

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Demo Project',
        description: 'Implementation of Swagger with TypeScript'
    },
    servers: [
        {
            url: process.env.SERVER_URL,
            description: 'Auth Server'
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/routers/apiRouter.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);