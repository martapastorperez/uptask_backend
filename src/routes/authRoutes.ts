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



export default router