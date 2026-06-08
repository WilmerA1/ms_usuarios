import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MS Usuarios API',
      version: '1.0.0',
      description: 'Microservicio de gestión de usuarios - BookLoop',
    },
    servers: [{ url: '/api/v1/users' }],
    components: {
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@email.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'juan@email.com' },
            password: { type: 'string', example: 'secret123' },
          },
        },
        ReviewRequest: {
          type: 'object',
          required: ['rating', 'comment'],
          properties: {
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            comment: { type: 'string', example: 'Excelente prestamista' },
            reviewerId: { type: 'string', example: 'user-abc-123' },
          },
        },
      },
    },
    paths: {
      '/register': {
        post: {
          summary: 'Registrar un nuevo usuario',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
          },
          responses: {
            201: { description: 'Usuario creado exitosamente' },
            400: { description: 'Datos inválidos' },
          },
        },
      },
      '/login': {
        post: {
          summary: 'Iniciar sesión',
          tags: ['Usuarios'],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            200: { description: 'Login exitoso, retorna JWT' },
            401: { description: 'Credenciales inválidas' },
          },
        },
      },
      '/{id}': {
        get: {
          summary: 'Obtener usuario por ID',
          tags: ['Usuarios'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Usuario encontrado' },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },
      '/{id}/reviews': {
        post: {
          summary: 'Agregar reseña a un usuario',
          tags: ['Reviews'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewRequest' } } },
          },
          responses: {
            201: { description: 'Reseña agregada' },
            404: { description: 'Usuario no encontrado' },
          },
        },
        get: {
          summary: 'Obtener reseñas de un usuario',
          tags: ['Reviews'],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Lista de reseñas' },
            404: { description: 'Usuario no encontrado' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
