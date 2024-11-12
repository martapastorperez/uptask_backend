import mongoose, { Schema, Document, Types} from "mongoose";

export interface IAuth extends Document{
    _id:Types.ObjectId
    email: string
    password: string
    name:string
    confirmed:boolean
}

const AuthSchema: Schema=new Schema({
    email:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    name:{
        type:String,
        require:true,
        trim:true
    },
    confirmed:{
        type:Boolean,
        default:false
    }
})

const Auth=mongoose.model<IAuth>('Auth', AuthSchema)
export default Auth