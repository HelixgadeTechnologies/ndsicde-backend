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
    servers: [{ url: " https://ndsicde-backend.onrender.com/" }],
    // servers: [{ url: "http://localhost:8000/" }],
    tags: [
      { name: "Auth", description: "Authentication Endpoints" },
      { name: "Upload", description: "Upload Endpoints" },
      { name: "General Settings", description: "GeneralSettings Endpoints" },
      { name: "Project Management", description: "ProjectManagement Endpoints" },
      { name: "User Management", description: "User Management Endpoints" },
      { name: "Strategic Objectives And Kpi", description: "Strategic Objectives And Kpi Endpoints" },
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
