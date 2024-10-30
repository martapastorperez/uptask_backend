import { Request, Response} from "express";
import Auth from "../models/Auth";
import { hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";

export class AuthController{
    static createUser=async(req:Request, res:Response)=>{
         try {
            const {password, email}=req.body
            //prevenir duplicados
            const userExist=await Auth.findOne({email})
            if (userExist) {
                const error=new Error('El usuario ya esta registrado')
                res.status(409).json({error:error.message})
                return
            }
            const user=new Auth(req.body)
            user.password= await hashPassword(password)

            const token= new Token()
            token.token=generateToken()
            token.user=user.id
    
            //ENVIAR EMAIL
           AuthEmail.sendConfirmationEmail({
            email:user.email,
            name:user.email,
            token:token.token
           })
            await Promise.allSettled([user.save(), token.save()])
            res.send('Usuario creado correctamente, revisa tu email para confirmarlo')
         } catch (error) {
            res.status(500).json({error:"Hubo un error"})
            console.log(error);
           }
    }
}