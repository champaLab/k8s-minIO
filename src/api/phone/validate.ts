import { defineBodySchema } from '../../utils/validationSchema'

export const validateCreatePhoneSchema = defineBodySchema({
  phoneNumber: { required: true },
  countryCode: { required: false },
  normalizedNumber: { required: false },
  status: { required: true, enum: ['blacklist', 'graylist', 'whitelist'] },
  prefix: { required: false },
  phoneType: { required: false, enum: ['mobile', 'landline', 'voip', 'unknown'] },
  expireAt: { required: false }
})

export const validateUpdatePhoneSchema = defineBodySchema({
  id: { required: true, type: 'number' },
  phoneNumber: { required: false },
  countryCode: { required: false },
  normalizedNumber: { required: false },
  status: { required: false, enum: ['blacklist', 'graylist', 'whitelist'] },
  prefix: { required: false },
  phoneType: { required: false, enum: ['mobile', 'landline', 'voip', 'unknown'] },
  expireAt: { required: false }
})

export const validateCreatePhone = validateCreatePhoneSchema.validators
export const validateCreatePhoneOpenApi = validateCreatePhoneSchema.toOpenApi

export const validateUpdatePhone = validateUpdatePhoneSchema.validators
export const validateUpdatePhoneOpenApi = validateUpdatePhoneSchema.toOpenApi
