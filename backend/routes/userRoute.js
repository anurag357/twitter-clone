import express from 'express'
import { Login, Logout, Register, bookMarks, fallow, getMyProfile, getOtherUser, unFallow } from '../controllers/userController.js'
import { isAuthenticated } from '../config/Auth.js'
const router = express.Router()

router.route("/register").post(Register)
router.route('/login').post(Login)
router.route('/logout').get(Logout)
router.route('/bookmarks/:id').put(isAuthenticated, bookMarks)
router.route('/profile/:id').get(isAuthenticated, getMyProfile)
router.route('/otherUser/:id').get(isAuthenticated, getOtherUser)
router.route('/follow/:id').post(isAuthenticated, fallow)
router.route('/unFollow/:id').post(isAuthenticated, unFallow)


export default router
