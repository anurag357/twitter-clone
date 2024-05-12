import { Tweet } from "../models/twitterSchema.js"
import { User } from "../models/userSchema.js"

export const createTweet = async(req,res) => {
    try {
        const {description, id} = req.body
        if(!description || !id){
            return res.status(401).json({
                message:"field are required!",
                success:false
            })
        }
        const user = await User.findById(id).select("-password")
        await Tweet.create({
            description,
            userId:id,
            userDetails:user,
        })
        return res.status(201).json({
            message:"Tweet creted successfully",
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const deleteTweet = async(req,res) => {
    try {
        const {id} = req.params
        await Tweet.findByIdAndDelete(id)
        return res.status(201).json({
            message:"Tweet delete successfully",
            status:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const likeOrDislike = async(req, res) => {
    try {
        const loggedInUserId = req.body.id
        const tweetId = req.params.id
        const tweet = await Tweet.findById(tweetId)
        if(tweet.like.includes(loggedInUserId)){
            //dislike
            await Tweet.findByIdAndUpdate(tweetId, {$pull:{like:loggedInUserId}})//pull method removes values from an array that matches a specified condition.
            return res.status(201).json({
                message:"User dislike your tweet",
                status:true
            })
        }else{
            //like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}}) // push method appends a specified value to an array.
            return res.status(201).json({
                message:"User Liked your photo",
                status:true
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getAllTweet = async(req,res) => {
    try {
        const id = req.params.id
        const loggedInUser = await User.findById(id)
        const loggedInUserTweet = await Tweet.find({userId:id})
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId)=>{
            return Tweet.find({userId:otherUserId})
        }))
        return res.status(201).json({
            tweets:loggedInUserTweet.concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error)
    }
}

export const gelFollowingUserTweet = async(req, res) => {
    try {
        const id = req.params.id
        const loggedInUser = await User.findById(id)
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUserId)=>{
            return Tweet.find({userId:otherUserId})
        }))
        return res.status(201).json({
            tweets:[].concat(...followingUserTweet)
        })
    } catch (error) {
        console.log(error)
    }
}