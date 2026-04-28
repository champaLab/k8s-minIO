import env from './env'

import { loginOpenApi } from './api/auth/validate'

const basePath = env.BASE_PATH === '/' ? '' : env.BASE_PATH

function requestBody(schema: { type: 'object'; required?: string[]; properties: Record<string, unknown> }) {
  return {
    required: true,
    content: {
      'application/json': { schema },
    },
  }
}

export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MAS System',
    version: '1.0.0',
    description: 'API for MAS System',
  },
  servers: [{ url: `${basePath}/v1`, description: 'API v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Admin JWT token (RS256)',
      },
      partnerApiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Partner API key',
      },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management' },
    { name: 'Dashboard', description: 'Dashboard summary statistics' },
  ],

  paths: {
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        requestBody: requestBody(loginOpenApi),
        responses: {
          200: { description: 'Login success, returns JWT' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/users': {
      post: {
        tags: ['Users'],
        summary: 'List all users',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'List of users' } },
      },
    },
    '/users/create': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'User created' } },
      },
    },
    '/users/{id}': {
      put: {
        tags: ['Users'],
        summary: 'Update user',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User updated' } },
      },
    },
    '/dashboard': {
      get: {
        tags: ['Dashboard'],
        summary: 'Get dashboard summary statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Summary statistics for users and phones',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        users: {
                          type: 'object',
                          properties: {
                            total: { type: 'integer' },
                            active: { type: 'integer' },
                            inactive: { type: 'integer' },
                            blocked: { type: 'integer' },
                            roles: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  role: { type: 'string' },
                                  count: { type: 'integer' }
                                }
                              }
                            }
                          }
                        },
                        phones: {
                          type: 'object',
                          properties: {
                            total: { type: 'integer' },
                            blacklist: { type: 'integer' },
                            graylist: { type: 'integer' },
                            whitelist: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
      },
    },
  },
}

