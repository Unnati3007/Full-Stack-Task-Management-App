const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "REST API for the Task Manager app (auth, tasks, users).",
    },
    servers: [{ url: "/", description: "Current server" }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      "/api/auth/register": {
        post: {
          summary: "Register a new user",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "User created" } },
        },
      },
      "/api/auth/login": {
        post: {
          summary: "Log in and receive JWT tokens",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Login success" } },
        },
      },
      "/api/tasks": {
        get: { summary: "List tasks", responses: { 200: { description: "Array of tasks" } } },
        post: { summary: "Create a task", responses: { 201: { description: "Created task" } } },
      },
      "/api/tasks/{id}": {
        put: {
          summary: "Update a task",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Updated task" } },
        },
        delete: {
          summary: "Delete a task",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
          responses: { 200: { description: "Deleted" } },
        },
      },
      "/api/users/me": {
        get: { summary: "Get current user profile", responses: { 200: { description: "User object" } } },
      },
    },
  },
  apis: [],
});

module.exports = swaggerSpec;
