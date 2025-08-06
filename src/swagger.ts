import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

// Swagger configuration
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NDSICDE API',
      version: '1.0.0',
      description: 'API documentation for NDSICDE.',
    },
    // servers: [{ url: "https://independent-hcdt-monitor-f08bd64395c9.herokuapp.com/" }],
    servers: [{ url: "http://localhost:8000/" }],
    tags: [
      { name: "Auth", description: "Authentication Endpoints" },
      { name: "Upload", description: "Upload Endpoints" },
      { name: "GeneralSettings", description: "GeneralSettings Endpoints" },
      { name: "ProjectManagement", description: "ProjectManagement Endpoints" },
      // { name: "Trust", description: "Trust Management Endpoints" },
      // { name: "Project", description: "Project Management Endpoints" },
      // { name: "Conflict", description: "Conflict Management Endpoints" },
      // { name: "Average Community Satisfaction", description: "Average Community Satisfaction Management Endpoints" },
      // { name: "Economic Impact", description: "Economic Impact Management Endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Important!
        }
      },
      schemas: {
      }
    }

  },
  apis: ['./src/routes/*.ts'], // Path to the API routes with Swagger comments
};

// Generate Swagger documentation
const swaggerSpec = swaggerJSDoc(options);

// Function to setup Swagger
const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
