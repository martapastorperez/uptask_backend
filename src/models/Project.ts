import mongoose,{ Schema, Document, PopulatedDoc, Types} from "mongoose";
import { ITask } from "./Task";
import { IAuth } from "./Auth";


export interface IProject extends Document {
    projectName:string
    clientName:string
    description:string
    tasks:PopulatedDoc<ITask & Document>[],
    manager:PopulatedDoc<IAuth & Document>
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
    }
},{timestamps:true})

const Project=mongoose.model<IProject >('Project', ProjectSchema)
export default Project