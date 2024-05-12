import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({
    path:"../config/.env"
})
const databaseConnect = () => {
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Mongodb connect successfuly!")
    }).catch((error)=>{
        console.log(error)
    })
}
export default databaseConnect