import express from 'express'
import { createTweet, deleteTweet, gelFollowingUserTweet, getAllTweet, likeOrDislike,  } from '../controllers/tweetController.js'
import { isAuthenticated } from '../config/Auth.js'
const router = express.Router()

router.route("/create").post(isAuthenticated, createTweet)
router.route("/delete/:id").delete(isAuthenticated, deleteTweet)
router.route("/like/:id").put(isAuthenticated, likeOrDislike)
router.route("/getAllTweet/:id").get(isAuthenticated, getAllTweet)
router.route("/getFollowingTweet/:id").get(isAuthenticated, gelFollowingUserTweet)


export default router
