import type { Request,Response } from "express"
import Project from "../models/Project";
import Task from "../models/Task";



export class TaskController{
    static createTask=async(req:Request, res:Response)=>{
        try {
         const task=new Task(req.body)
         task.project=req.project.id
         req.project.tasks.push(task.id)
         await Promise.allSettled([task.save(), req.project.save()])
         res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }

     static getAllTask=async(req:Request, res:Response)=>{
        try {
            const task=await Task.find({project:req.project.id}).populate('project')
            res.json(task)
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }

     static getTaskById=async(req:Request, res:Response)=>{
        try {
            res.json(req.task)
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }

     static updateTask=async(req:Request, res:Response)=>{
        try {
            req.task.Name=req.body.name
            req.task.description=req.body.descripcion
            await req.task.save()
            res.send('Tarea actualizada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }

     static deleteTask=async(req:Request, res:Response)=>{
        try {
            req.project.tasks = req.project.tasks.filter((task)=> task.toString()!==req.task.id.toString())
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])
            res.send('Tarea eliminada correctamente')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }

     static updateStatus=async(req:Request, res:Response)=>{
        try {
            const {status}=req.body 
            req.task.status=status
            await req.task.save()
            res.send('Estado de  la tarea actualizada')
        } catch (error) {
            res.status(500).json({error:'Hubo un error'})
        }
     }


}