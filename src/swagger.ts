import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

// Swagger configuration
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NDSICDE API",
      version: "1.0.0",
      description: "API documentation for NDSICDE.",
    },

    servers: [{ url: "https://ndsicde-backend66.onrender.com/" }, { url: "http://localhost:8000/" }],

    tags: [
      { name: "Auth", description: "Authentication Endpoints" },
      { name: "Upload", description: "Upload Endpoints" },
      { name: "General Settings", description: "GeneralSettings Endpoints" },
      {
        name: "Project Management",
        description: "ProjectManagement Endpoints",
      },
      { name: "User Management", description: "User Management Endpoints" },
      {
        name: "Strategic Objectives And Kpi",
        description: "Strategic Objectives And Kpi Endpoints",
      },
      // { name: "AuditLog", description: "AuditLogs Endpoints" },
      // { name: "DataValidation", description: "Data Validation Endpoints" },
      // { name: "Economic Impact", description: "Economic Impact Management Endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Important!
        },
      },

      schemas: {
        IIndicator: {
          type: "object",
          properties: {
            indicatorId: {
              type: "string",
              example: "uuid-1234-5678",
            },
            indicatorSource: {
              type: "string",
              example: "Survey Data",
            },
            thematicAreasOrPillar: {
              type: "string",
              example: "Health",
            },
            statement: {
              type: "string",
              example: "Increase vaccination coverage",
            },
            linkKpiToSdnOrgKpi: {
              type: "string",
              example: "KPI-001",
            },
            definition: {
              type: "string",
              example: "Percentage of children vaccinated",
            },
            specificArea: {
              type: "string",
              example: "Child Health",
            },
            unitOfMeasure: {
              type: "string",
              example: "Percentage",
            },
            itemInMeasure: {
              type: "string",
              example: "Children aged 1-5 years",
            },
            disaggregationId: {
              type: "string",
              example: "uuid-1234-5678",
            },
            baseLineDate: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            cumulativeValue: {
              type: "number",
              example: 30,
            },
            baselineNarrative: {
              type: "string",
              example: "Baseline established in 2023",
            },
            targetDate: {
              type: "string",
              format: "date-time",
              example: "2025-12-31T00:00:00Z",
            },
            cumulativeTarget: {
              type: "number",
              example: 80,
            },
            targetNarrative: {
              type: "string",
              example: "Target set by 2025",
            },
            targetType: {
              type: "string",
              example: "Percentage",
            },
            responsiblePersons: {
              type: "string",
              example: "Dr. John Doe, Jimmy smit Johnson",
            },
            result: {
              type: "string",
              example: "uuid-5678-1234",
            },
            resultTypeId: {
              type: "string",
              example: "uuid-5678-1234",
            },
          },
        },
        IIndicatorReport: {
          type: "object",
          properties: {
            indicatorReportId: {
              type: "string",
              example: "uuid-1234",
            },
            indicatorSource: {
              type: "string",
              example: "Survey Data",
            },
            thematicAreasOrPillar: {
              type: "string",
              example: "Education",
            },
            indicatorStatement: {
              type: "string",
              example: "Increase literacy rate",
            },
            responsiblePersons: {
              type: "string",
              example: "John Doe",
            },
            disaggregationId: {
              type: "string",
              example: "uuid-1234-5678",
            },
            actualDate: {
              type: "string",
              format: "date-time",
            },
            cumulativeActual: {
              type: "string",
              example: "75",
            },
            actualNarrative: {
              type: "string",
              example: "Improvement observed in rural literacy",
            },
            attachmentUrl: {
              type: "string",
              example: "https://example.com/report.pdf",
            },
            status: {
              type: "string",
              example: "PENDING, APPROVE, DECLINE",
            },
            indicatorId: {
              type: "string",
              example: "impact-uuid-5678",
            },
            resultTypeId: {
              type: "string",
              example: "impact-uuid-5678",
            },
          },
        },
        Output: {
          type: "object",
          required: ["outputStatement", "responsiblePerson"],
          additionalProperties: false,
          properties: {
            outputId: {
              type: "string",
              format: "uuid",
              example: "6f5c477c-f27f-11ef-aadb-204747b55a5a",
              description: "Primary key (provide when updating)",
            },
            outputStatement: {
              type: "string",
              example: "Increase literacy in target communities",
              description: "A short statement describing the output (required)",
            },
            outcomeId: {
              type: "string",
              format: "uuid",
              example: "outcome-uuid-1234",
              description: "Related outcome ID (optional)",
            },
            thematicAreas: {
              type: "string",
              example: "Education",
              description: "Thematic areas relevant to this output (optional)",
            },
            responsiblePerson: {
              type: "string",
              example: "Jane Doe",
              description: "Person responsible for the output (required)",
            },
            projectId: {
              type: "string",
              format: "uuid",
              example: "project-uuid-5678",
              description: "Related project ID (optional)",
            },
            resultTypeId: {
              type: "string",
              example: "impact-uuid-5678",
            },
          },
          example: {
            outputId: "6f5c477c-f27f-11ef-aadb-204747b55a5a",
            outputStatement: "Increase literacy in target communities",
            outcomeId: "outcome-uuid-1234",
            thematicAreas: "Education",
            responsiblePerson: "Jane Doe",
            projectId: "project-uuid-5678",
          },
        },
        Activity: {
          type: "object",
          properties: {
            activityId: {
              type: "string",
              format: "uuid",
              description: "Unique ID of the activity",
            },
            activityStatement: {
              type: "string",
              nullable: true,
              description: "Statement or name of the activity",
            },
            outputId: {
              type: "string",
              nullable: true,
              description: "ID of the related output",
            },
            activityTotalBudget: {
              type: "integer",
              nullable: true,
              description: "Total budget allocated for the activity",
            },
            responsiblePerson: {
              type: "string",
              nullable: true,
              description: "Person responsible for the activity",
            },
            startDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Start date of the activity",
            },
            endDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "End date of the activity",
            },
            activityFrequency: {
              type: "integer",
              nullable: true,
              description: "Frequency of the activity",
            },
            subActivity: {
              type: "string",
              nullable: true,
              description: "Sub-activity or component of the main activity",
            },
            descriptionAction: {
              type: "string",
              nullable: true,
              description: "Description of the action or task",
            },
            deliveryDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Delivery or completion date",
            },
            projectId: {
              type: "string",
              nullable: true,
              description: "ID of the related project",
            },
          },
        },
        ActivityReport: {
          type: "object",
          properties: {
            activityReportId: {
              type: "string",
              format: "uuid",
              description: "Unique identifier of the activity report",
              example: "a6f3b5c4-1234-4e67-9b23-12ab34cd56ef",
            },
            activityId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "The related Activity ID",
              example: "3a4f7b5c-98ef-4b67-b210-45fd23de78ab",
            },
            percentageCompletion: {
              type: "integer",
              nullable: true,
              description: "Percentage of completion for the activity",
              example: 75,
            },
            actualStartDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Actual start date of the activity",
              example: "2025-07-01T08:30:00.000Z",
            },
            actualEndDate: {
              type: "string",
              format: "date-time",
              nullable: true,
              description: "Actual end date of the activity",
              example: "2025-07-20T18:00:00.000Z",
            },
            actualCost: {
              type: "integer",
              nullable: true,
              description: "Actual cost incurred for the activity",
              example: 12000,
            },
            actualNarrative: {
              type: "string",
              nullable: true,
              description: "Narrative or description of actual progress",
              example:
                "The training workshop was successfully executed with 50 participants.",
            },
          },
        },
        LogicalFramework: {
          type: "object",
          properties: {
            logicalFrameworkId: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the LogicalFramework",
            },
            projectId: {
              type: "string",
              nullable: true,
              description: "Reference to the Project ID",
            },
            documentName: {
              type: "string",
              nullable: true,
              description: "Name of the document",
            },
            documentURL: {
              type: "string",
              nullable: true,
              description: "URL where the document is stored",
            },
          },
        },
        Request: {
          type: "object",
          properties: {
            requestId: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the Request",
            },
            staff: {
              type: "string",
              nullable: true,
              description: "Staff name associated with the request",
            },
            outputId: {
              type: "string",
              nullable: true,
              description: "Reference to the Output ID",
            },
            activityTitle: {
              type: "string",
              nullable: true,
            },
            activityBudgetCode: {
              type: "integer",
              nullable: true,
            },
            activityLocation: {
              type: "string",
              nullable: true,
            },
            activityPurposeDescription: {
              type: "string",
              nullable: true,
            },
            activityStartDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            activityEndDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            activityLineDescription: {
              type: "string",
              nullable: true,
            },
            quantity: {
              type: "integer",
              nullable: true,
            },
            frequency: {
              type: "integer",
              nullable: true,
            },
            unitCost: {
              type: "integer",
              nullable: true,
            },
            budgetCode: {
              type: "integer",
              nullable: true,
            },
            total: {
              type: "integer",
              nullable: true,
            },
            modeOfTransport: {
              type: "string",
              nullable: true,
            },
            driverName: {
              type: "string",
              nullable: true,
            },
            driversPhoneNumber: {
              type: "string",
              nullable: true,
            },
            vehiclePlateNumber: {
              type: "string",
              nullable: true,
            },
            vehicleColor: {
              type: "string",
              nullable: true,
            },
            departureTime: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            route: {
              type: "string",
              nullable: true,
            },
            recipientPhoneNumber: {
              type: "string",
              nullable: true,
            },
            documentName: {
              type: "string",
              nullable: true,
            },
            documentURL: {
              type: "string",
              nullable: true,
            },
            projectId: {
              type: "string",
              nullable: true,
              description: "Reference to the Project ID",
            },
            status: {
              type: "string",
              nullable: true,
            },
          },
        },
        Retirement: {
          type: "object",
          properties: {
            retirementId: {
              type: "string",
              format: "uuid",
            },
            activityLineDescription: {
              type: "string",
            },
            lineItem: {
              type: "string",
            },
            quantity: {
              type: "integer",
            },
            frequency: {
              type: "integer",
            },
            unitCost: {
              type: "integer",
            },
            actualCost: {
              type: "integer",
            },
            totalBudget: {
              type: "integer",
            },
            actualCostOfLineItem: {
              type: "integer",
            },
            documentName: {
              type: "string",
            },
            documentURL: {
              type: "string",
            },
            requestId: {
              type: "string",
              format: "uuid",
            },
            status: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes with Swagger comments
};

// Generate Swagger documentation
const swaggerSpec = swaggerJSDoc(options);

// Function to setup Swagger
const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
