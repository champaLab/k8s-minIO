import Router from 'express'
import { checkRole } from './middlewares/checkRole'
import { verify } from './utils/jwt'
import { validateResult } from './utils/validateResult'
import { loginValidate, updatePasswordValidate } from './api/auth/validate'
import { accessTokenForPartnerController, loginController, updatePasswordController } from './api/auth/controller'
import { createUserController, getUserController, updateUserController } from './api/user/controller'
import { validateCreateUser, validateUpdateUser } from './api/user/validate'
import { createPhoneController, deletePhoneController, getPhoneListController, updatePhoneController } from './api/phone/controller'
import { validateCreatePhone, validateUpdatePhone } from './api/phone/validate'
import { getDashboardController } from './api/dashboard/controllor'
import { downloadFromS3Controller, uploadMemory, uploadToS3Controller } from './api/files/controller'

const router = Router()


// Auth
router.post('/login', loginValidate, validateResult, loginController)
router.post('/me', verify, accessTokenForPartnerController)
router.put('/auth/password/update', verify, updatePasswordValidate, validateResult, updatePasswordController)

router.get('/dashboard', verify, getDashboardController)

router.post('/users', getUserController)
router.post(
  '/users/create',
  validateCreateUser,
  validateResult,
  createUserController
)
router.put(
  '/users/:id',
  verify,
  checkRole(['ADMIN']),
  validateUpdateUser,
  validateResult,
  updateUserController
)

// Phone
router.post('/phone', getPhoneListController)
router.post('/phone/create', verify, checkRole(['ADMIN', 'OPERATOR']), validateCreatePhone, validateResult, createPhoneController)
router.put('/phone', verify, checkRole(['ADMIN', 'OPERATOR']), validateUpdatePhone, validateResult, updatePhoneController)
router.delete('/phone', verify, checkRole(['ADMIN']), deletePhoneController)

// Files (S3)
router.post('/files/upload', uploadMemory.single('file'), uploadToS3Controller)
router.get('/files/download', downloadFromS3Controller)

export default router
