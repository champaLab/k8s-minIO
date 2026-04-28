import { defineBodySchema } from '../../utils/validationSchema'

const validateCreateUserSchema = defineBodySchema({
  telephone: { required: true },
  password: { required: true },
  status: { required: true, enum: ['ACTIVE', 'INACTIVE', 'BLOCK'] },
  role: { required: true, enum: ['ADMIN', 'OPERATOR', 'VIEWER'] },
  id: { required: false, type: 'number' },
})

const validateUpdateUserSchema = defineBodySchema({
  id: { required: false, type: 'number' },
  telephone: { required: true },
  password: { required: false },
  status: { required: true, enum: ['ACTIVE', 'INACTIVE', 'BLOCK'] },
  role: { required: true, enum: ['ADMIN', 'OPERATOR', 'VIEWER'] },
})

export const validateCreateUser = validateCreateUserSchema.validators
export const validateCreateUserOpenApi = validateCreateUserSchema.toOpenApi

export const validateUpdateUser = validateUpdateUserSchema.validators
export const validateUpdateUserOpenApi = validateUpdateUserSchema.toOpenApi
