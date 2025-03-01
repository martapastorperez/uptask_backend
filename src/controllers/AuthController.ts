import { Request, Response} from "express";
import Auth from "../models/Auth";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmails";
import { generateJWT } from "../utils/jwt";

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
            name:user.name,
            token:token.token
           })
            await Promise.allSettled([user.save(), token.save()])
            res.send('Usuario creado correctamente, revisa tu email para confirmarlo')
         } catch (error) {
            res.status(500).json({error:"Hubo un error"})
            console.log(error);
           }
    }

    static confirmUser= async (req:Request,res:Response)=>{
        try {
            const {token}= req.body
            const tokenExist=await Token.findOne({token})
            if (!tokenExist) {
                const error=new Error('Token no valido')
                res.status(404).json({error:error.message})
                return
            }

            const user= await Auth.findById(tokenExist.user)
            user.confirmed=true
            await Promise.allSettled([
                user.save(),
                tokenExist.deleteOne()
            ])

            res.send('Cuenta confirmada correctamente')
            
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
            console.log(error);
        }
    }
    
    static login= async (req:Request,res:Response)=>{
        try {
            const {password, email, confirmed}=req.body
            const userExist=await Auth.findOne({email})
            if (!userExist) {
                const error=new Error('Usuario no encontrado')
                res.status(404).json({error:error.message})
                return
            }
            if(!userExist.confirmed){
                const token=new Token()
                token.user=userExist.id
                token.token=generateToken()
                await token.save()

                  //ENVIAR EMAIL
                AuthEmail.sendConfirmationEmail({
                    email:userExist.email,
                    name:userExist.name,
                    token:token.token
                })
                
                const error=new Error('La cuenta no ha sido confirmada, hemos enviado un email de confirmacion')
                res.status(401).json({error:error.message})
                return
            }
            
            const isPasswordCorrect=await checkPassword(password, userExist.password)
            if(!isPasswordCorrect){
                const error=new Error('Password incorrecto')
                res.status(401).json({error:error.message})
                return
            }
            const token=generateJWT({id:userExist._id})
            res.send(token)
            
        } catch (error) {
            res.status(500).json({error:"Hubo un error"})
            console.log(error);
        }
    }


static requestConfirmationCode=async(req:Request, res:Response)=>{
    try {
       const {email}=req.body
       //usuario existe
       const user=await Auth.findOne({email})
       if (!user) {
           const error=new Error('El usuario no esta esta registrado')
           res.status(409).json({error:error.message})
           return
       }
       if (user.confirmed) {
            const error=new Error('El usuario ya esta confirmado')
            res.status(403).json({error:error.message})
            return
       }
       
       const token= new Token()
       token.token=generateToken()
       token.user=user.id

       //ENVIAR EMAIL
      AuthEmail.sendConfirmationEmail({
       email:user.email,
       name:user.name,
       token:token.token
      })
       await Promise.allSettled([user.save(), token.save()])
       res.send('Se envio un nuevo token a tu email')
    } catch (error) {
       res.status(500).json({error:"Hubo un error"})
       console.log(error);
      }
}



static forgotPassword=async(req:Request, res:Response)=>{
    try {
       const {email}=req.body
       //usuario existe
       const user=await Auth.findOne({email})
       if (!user) {
           const error=new Error('El usuario no esta esta registrado')
           res.status(409).json({error:error.message})
           return
       }
       
       const token= new Token()
       token.token=generateToken()
       token.user=user.id
       await token.save()

       //ENVIAR EMAIL
      AuthEmail.sendPasswordResetToken({
       email:user.email,
       name:user.name,
       token:token.token
      })
      
       res.send('Revisa tu email para instrucciones')
    } catch (error) {
       res.status(500).json({error:"Hubo un error"})
       console.log(error);
      }
}

static validateToken=async(req:Request, res:Response)=>{
    try {
        const {token}= req.body
        const tokenExist=await Token.findOne({token})
        if (!tokenExist) {
            const error=new Error('Token no valido')
            res.status(404).json({error:error.message})
            return
        }
        res.send('Token valido, define tu nuevo password')
        
    } catch (error) {
        res.status(500).json({error:"Hubo un error"})
        console.log(error);
    }
}

static updatePasswordWithToken=async(req:Request, res:Response)=>{
    try {
        const {token}= req.params
        const tokenExist=await Token.findOne({token})
        if (!tokenExist) {
            const error=new Error('Token no valido')
            res.status(404).json({error:error.message})
            return
        }
        const user=await Auth.findById(tokenExist.user)
        user.password=await hashPassword(req.body.password)

        await Promise.allSettled([user.save(), tokenExist.deleteOne()])

        res.send('El password se modifico correctamente')
        
    } catch (error) {
        res.status(500).json({error:"Hubo un error"})
        console.log(error);
    }
}

static user=async(req:Request, res:Response)=>{
    res.json(req.user)
    return
}

static updateProfile=async(req:Request, res:Response)=>{
    const {name,email}=req.body
    const userExist=await Auth.findOne({email})
    if(userExist && userExist.id.toString() !== req.user.id.toString()){
        const error = new Error('Ese email ya esta registrado')
        res.status(409).json({error:error.message})
        return
    }
    req.user.name=name
    req.user.email=email
    try {
       await req.user.save()
       res.send('Perfil actualizado correactamente')
        
    } catch (error) {
        res.status(500).json({error:"Hubo un error"})
        console.log(error);
    }
}


static updatePassword=async(req:Request, res:Response)=>{
    const {current_password,password,password_confirmation}=req.body

    const user=await Auth.findById(req.user.id)

    const isPasswordCorrect=await checkPassword(current_password, user.password)
    if(!isPasswordCorrect){
        const error = new Error('El password actual es incorrecto')
        res.status(409).json({error:error.message})
        return
    }
    
    try {
        user.password=await hashPassword(password)
        await user.save()
        res.send('El password se modifico correctamente')
        
    } catch (error) {
        res.status(500).json({error:"Hubo un error"})
        console.log(error);
    }
}

static checkPassword=async(req:Request, res:Response)=>{
    const {password}=req.body

    const user=await Auth.findById(req.user.id)

    const isPasswordCorrect=await checkPassword(password, user.password)
    if(!isPasswordCorrect){
        const error = new Error('El password es incorrecto')
        res.status(409).json({error:error.message})
        return
    }
    

        res.send('El password es correcto')
        
}
}


