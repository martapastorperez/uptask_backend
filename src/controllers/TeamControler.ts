import type { Request,Response } from "express"
import Auth from "../models/Auth"

export class TeamController{
    static findMemberByEmail = async(req:Request, res:Response)=>{
        const {email}=req.body
        //Find user
        const user= await Auth.findOne({email}).select('id email name')
        if (!user) {
            const error=new Error('Usuario no encontrado')
            res.status(404).json({error:error.message})
            return
        }
        res.json(user)
    }

    static addMemberById = async(req:Request, res:Response)=>{
        const {id}=req.body
        const user= await Auth.findById(id).select('id')
        if (!user) {
            const error=new Error('Usuario no encontrado')
            res.status(404).json({error:error.message})
            return
        }
        if (req.project.team.some(team=>team.toString()===user.id.toString())) {
            const error=new Error('Usuario ya existe')
            res.status(409).json({error:error.message})
            return
        }

        req.project.team.push(user.id)
        await req.project.save()
        res.send('Usuario agregado correctamente')
    }
}