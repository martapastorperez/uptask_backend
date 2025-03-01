import type { Request,Response,NextFunction } from "express"
import jwt from "jsonwebtoken"
import Auth, { IAuth } from "../models/Auth"


declare global{
    namespace Express{
        interface Request{
            user?: IAuth
        }
    }
}

export const authenticate=async(req:Request, res:Response, next:NextFunction)=>{
    const bearer=req.headers.authorization
    if(!bearer){
        const error=new Error('No autorizado')
        res.status(401).json({error:error.message})
        return
    }

    const [,token]= bearer.split(' ')

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if (typeof decoded==='object' && decoded.id) {
            const user = await Auth.findById(decoded.id)
            console.log(user);
        
            if (user) {
                req.user=user
            }else{
                res.status(500).json({error:'Token no valido'})
            }
        }
        
    } catch (error) {
        res.status(500).json({error:'Token no valido'})

    }
    next()
    
}