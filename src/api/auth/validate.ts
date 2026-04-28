import { defineBodySchema } from '../../utils/validationSchema'

const loginSchema = defineBodySchema({
  telephone: { required: true },
  password: { required: true },
})

const partnerLoginSchema = defineBodySchema({
  email: { required: true, format: 'email' },
  password: { required: true },
})


const updatePasswordSchema = defineBodySchema({
  new_password: { required: true, minLength: 3 },
  confirm_password: { required: true, },
  current_password: { required: true },
})

export const updatePasswordValidate = updatePasswordSchema.validators


export const loginValidate = loginSchema.validators
export const partnerLoginValidate = partnerLoginSchema.validators

export const loginOpenApi = loginSchema.toOpenApi
export const partnerLoginOpenApi = partnerLoginSchema.toOpenApi
