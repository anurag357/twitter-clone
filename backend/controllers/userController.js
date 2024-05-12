import { User } from "../models/userSchema.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const Register = async(req, res) => {
    try {
        const {name, username, email, password} = req.body
        if(!name || !username || !email || !password){
            return res.status(401).json({
                message:"All field are required!",
                success:false
            })
        }
        const user = await User.findOne({email})
        if(user){
            return res.status(401).json({
                message:"User already register!",
                success:false
            })
        }
        const hashedPassword = await bcryptjs.hash(password, 16)
        await User.create({
            name,
            username,
            email,
            password:hashedPassword
        })

        return res.status(201).json({
            message:"Account created successfuly!",
            success:true
            
        })
    } catch (error) {
        console.log(error)
    }
}

export const Login = async(req,res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            return res.status(401).json({
                message:"All field are required!",
                success:false
            })
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                message:"User does not exist with this email!",
                success: false
            })
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!isMatch){
            return res.status(401).json({
                message:"Incorect email or password!",
                success: false
            })
        }
        const tokenData={
            userID:user._id
        }
        const token = await jwt.sign(tokenData , process.env.TOKEN_SECRET, {expiresIn:"1d"})
        return res.status(201).cookie("token", token, {expiresIn:"1d", httpOnly:true}).json({
            message:`Welcome back ${user.name}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const Logout = (req,res)=>{
    return res.cookie("token", "",  {expiresIn:new Date(Date.now())}).json({
        message:"User Logged out successfuly",
        status:true
    })
}

export const bookMarks = async(req, res) => {
    try {
        const loggedInUserId = req.body.id
        const tweetId = req.params.id
        const user = await User.findById(loggedInUserId)
        if(user.bookmarks.includes(tweetId)){
            //dislike
            await User.findByIdAndUpdate(loggedInUserId, {$pull:{bookmarks:tweetId}})
            return res.status(201).json({
                message:"Remove from bookmarks ",
                status:true
            })
        }else{
            //like
            await User.findByIdAndUpdate(loggedInUserId, {$push:{bookmarks:tweetId}})
            return res.status(201).json({
                message:"Saved to bookmarks",
                status:true
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getMyProfile = async(req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id).select('-password')
        return res.status(201).json({
            user,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getOtherUser = async(req,res) => {
    try {
        const id = req.params.id
        const otherUser = await User.find({_id:{$ne:id}}).select('-password')
        if(!otherUser){
            return res.status(401).json({
                message:"Currently do nat have any user",
                success:false
            })
        }
        return res.status(201).json({
            otherUser,
        })
    } catch (error) {
        console.log(error)
    }
}

export const fallow = async(req, res) => {
    try {
        const loggedInUserId = req.body.id
        const userId = req.params.id
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if(!user.followers.includes(loggedInUserId)){
            await user.updateOne({$push:{followers:loggedInUserId}})
            await loggedInUser.updateOne({$push:{following:userId}})
        }else{
            return res.status(401).json({
                message:`User all ready followed ${user.name}`
            })
        }
        return res.status(201).json({
            message:`${loggedInUser.name} just follow to ${user.name}`,
            success:true
        })       
    } catch (error) {
        console.log(error)
    }
}

export const unFallow = async(req, res) => {
    try {
        const loggedInUserId = req.body.id
        const userId = req.params.id
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if(loggedInUser.following.includes(userId)){
            await user.updateOne({$pull:{followers:loggedInUserId}})//$pull:use for delete followers
            await loggedInUser.updateOne({$pull:{following:userId}})
        }else{
            return res.status(401).json({
                message:`User has nat followed yet`
            })
        }
        return res.status(201).json({
            message:`${loggedInUser.name}  unfollow to ${user.name}`,
            success:true
        })       
    } catch (error) {
        console.log(error)
    }
}