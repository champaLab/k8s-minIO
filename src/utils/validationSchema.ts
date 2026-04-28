/**
 * Schema-first validation: กำหนด schema เดียว → สร้างทั้ง express-validator และ OpenAPI
 *
 * Usage:
 *   const schema = defineBodySchema({ username: { required: true }, password: { required: true } })
 *   export const loginValidate = schema.validators
 *   export const loginOpenApi = schema.toOpenApi()
 */
import { body, ValidationChain } from 'express-validator'

export type FieldSchema = {
  type?: 'string' | 'number' | 'integer'
  format?: 'email' | 'date'
  required?: boolean
  exists?: boolean
  minLength?: number
  maxLength?: number
  pattern?: string
  enum?: (string | number)[]
}

export type BodySchema = Record<string, FieldSchema>

function buildValidator(field: string, rules: FieldSchema): ValidationChain {
  let chain = body(field)

  if (rules.required) {
    chain = chain.notEmpty().withMessage(`${field} is required`)
  } else if (rules.exists) {
    chain = chain.exists().withMessage(`${field} is required`)
  } else {
    chain = chain.optional()
  }

  if (rules.type === 'number' || rules.type === 'integer') {
    chain = chain.isNumeric().withMessage(`${field} must be a number`)
  }

  if (rules.format === 'email') {
    chain = chain.isEmail().withMessage(`Please enter a valid email address`)
  }

  if (rules.format === 'date') {
    chain = chain.isISO8601().withMessage(`${field} must be in ISO 8601 format (YYYY-MM-DD)`)
  }

  if (rules.pattern) {
    chain = chain.matches(new RegExp(rules.pattern)).withMessage(`${field} has invalid format`)
  }

  if (rules.enum) {
    chain = chain.isIn(rules.enum.map(String)).withMessage(`${field} must be one of: ${rules.enum.join(', ')}`)
  }

  if (rules.minLength !== undefined) {
    const opts = rules.maxLength ? { min: rules.minLength, max: rules.maxLength } : { min: rules.minLength }
    chain = chain.isLength(opts).withMessage(`${field} must be ${rules.minLength} characters`)
  } else if (rules.maxLength !== undefined) {
    chain = chain.isLength({ max: rules.maxLength }).withMessage(`${field} must be less than ${rules.maxLength + 1} characters`)
  }

  if (rules.type === 'string' && !rules.format && !rules.pattern) {
    chain = chain.isString().withMessage(`${field} must be a string`)
  }

  return chain
}

function toOpenApiProperty(field: string, rules: FieldSchema): Record<string, unknown> {
  const prop: Record<string, unknown> = {}

  if (rules.type) prop.type = rules.type
  else if (rules.format === 'email' || rules.format === 'date') prop.type = 'string'
  else prop.type = 'string'

  if (rules.format) prop.format = rules.format
  if (rules.pattern) prop.pattern = rules.pattern
  if (rules.enum) prop.enum = rules.enum
  if (rules.minLength !== undefined) prop.minLength = rules.minLength
  if (rules.maxLength !== undefined) prop.maxLength = rules.maxLength

  return prop
}

/**
 * กำหนด body schema แล้วได้ทั้ง validators และ OpenAPI schema
 */
export function defineBodySchema(schema: BodySchema) {
  const validators: ValidationChain[] = Object.entries(schema).map(([field, rules]) =>
    buildValidator(field, rules)
  )

  const required = Object.entries(schema)
    .filter(([, r]) => r.required || r.exists)
    .map(([f]) => f)

  const properties = Object.fromEntries(
    Object.entries(schema).map(([field, rules]) => [field, toOpenApiProperty(field, rules)])
  )

  const openApiSchema = {
    type: 'object' as const,
    required: required.length > 0 ? required : undefined,
    properties,
  }

  return {
    validators,
    toOpenApi: openApiSchema,
  }
}
