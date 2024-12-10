import mongoose,{ Schema, Document, PopulatedDoc, Types} from "mongoose";
import Task, { ITask } from "./Task";
import { IAuth } from "./Auth";
import Note from "./Note";


export interface IProject extends Document {
    projectName:string
    clientName:string
    description:string
    tasks:PopulatedDoc<ITask & Document>[],
    manager:PopulatedDoc<IAuth & Document>,
    team:PopulatedDoc<IAuth & Document>[]
}

const ProjectSchema: Schema= new Schema({
    projectName:{
        type:String,
        require:true,
        trim:true,
    },
    clientName:{
        type:String,
        require:true,
        trim:true,
    },
    description:{
        type:String,
        require:true,
        trim:true,
    },
    tasks:[
        {
            type:Types.ObjectId,
            ref:'Task'
        }
    ],
    manager:{
        type:Types.ObjectId,
        ref:'Auth'
    },
    team:[
        {
            type:Types.ObjectId,
            ref:'Auth'
        }
    ],
},{timestamps:true})

//Middleware
ProjectSchema.pre('deleteOne', {document:true, query:false}, async function () {
    const projectId=this._id
    if(!projectId) return
    const tasks=await Task.find({project:projectId})
    for (const task of tasks) {
        await Note.deleteMany({task:task.id})
    }
    await Task.deleteMany({project:projectId})
})


const Project=mongoose.model<IProject >('Project', ProjectSchema)
export default Project