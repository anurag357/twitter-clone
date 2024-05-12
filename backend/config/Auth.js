import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({
    path:"../config/.env"
})
export const isAuthenticated = async(req,res, next)=>{
    try {
        const token = req.cookies.token;
        console.log(token)
        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                status:false
            })
        }     
        const decode = await jwt.verify(token, process.env.TOKEN_SECRET)   
        console.log(decode)
        req.user = decode.id
        next()
    } catch (error) {
        console.log(error)
    }
}