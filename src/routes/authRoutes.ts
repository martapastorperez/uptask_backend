import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

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


export default router