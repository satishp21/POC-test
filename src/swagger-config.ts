import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    info: {
      title: "Admin API",
      version: "1.0.0",
      description: "Documentation for Admin API",
    },
    tags: [
      {
        name: "User Management",
        description: "User related operations",
      },
    ],
    securityDefinitions: {
      BearerAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"], // Specify the path to your API routes files
};

const specs = swaggerJsdoc(options);

export default specs;
