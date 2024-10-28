import { CorsOptions } from "cors";


export const corsConfig:CorsOptions={
    origin: function(origin, callback){
        const whitelist=[process.env.FRONTEND_URL]
if(!origin){//for bypassing postman req with  no origin
      return callback(null, true);
    }
        if(whitelist.includes(origin)){
            callback(null,true)
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}