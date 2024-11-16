import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router=Router()

router.get('/', )

router.post('/create-account', 
    body('email').isEmail().notEmpty().withMessage('El email es obligatorio'),
    body('password').isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres').notEmpty().withMessage('El password es obligatorio'),
    body('password_confirmation').custom((value,{req})=>{
        if (value!==req.body.password) {
           throw new Error('Los password no son iguales')
        }
        return true
    }),
    body('name').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    handleInputErrors,
    AuthController.createUser
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.confirmUser
)


router.post('/login',
    body('email').isEmail().notEmpty().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().notEmpty().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().notEmpty().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('El token no puede ir vacio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token no valido'),
    body('password').isLength({min:8}).withMessage('El password es muy corto, minimo 8 caracteres').notEmpty().withMessage('El password es obligatorio'),
    body('password_confirmation').custom((value,{req})=>{
        if (value!==req.body.password) {
           throw new Error('Los password no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)


export default router