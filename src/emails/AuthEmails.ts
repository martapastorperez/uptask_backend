import { transport } from "../config/nodemailer"


interface IEmail{
    email:string
    name:string
    token:string
}

export class AuthEmail{
    static sendConfirmationEmail = async(user:IEmail)=>{
         const info=await transport.sendMail({
            from:'UpTask <admin@uptask.com>',
            to:user.email,
            subject:'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta.</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirma tu cuenta</a>
                    <p>Ingresa el codigo: <b>${user.token}</b></p>
                    <p>Este token expira en 10 minutos</p>`
        }) 
        console.log('Mensaje enviado', info.messageId);
        
    }


    static sendPasswordResetToken = async(user:IEmail)=>{
         const info=await transport.sendMail({
            from:'UpTask <admin@uptask.com>',
            to:user.email,
            subject:'UpTask - Restablecer password',
            text: 'UpTask - Restablecer password',
            html: `<p>Hola: ${user.name}, has solicitado restablecer tu password.</p>
                    <p>Visita el siguiente enlace:</p>
                    <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer password</a>
                    <p>Ingresa el codigo: <b>${user.token}</b></p>
                    <p>Este token expira en 10 minutos</p>`
        }) 
        console.log('Mensaje enviado', info.messageId);
        
    }
}