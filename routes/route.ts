import express from 'express'


// service
const auth_s = require('../services/auth')
import { upload } from '../services/upload'
// controllers
const test_ct = require('../controllers/test_controller')
const login_ct = require('../controllers/login_controller')
const project_ct = require('../controllers/project_controller')
const user_ct = require('../controllers/user_controller')

const auth = require('../services/auth')

const route = express.Router()

// test
// test faker data
route.get('/faker_users',test_ct.test_Users)

// auth
// check token is valid
route.post('/isTokenExpied',auth.isTokenExpied)

// login controller
// login
route.post('/login',login_ct.login)

// student repgister
route.post('/userRegister',login_ct.userRegister)

// register first time to login
route.post('/registerFirstTime',login_ct.registerFirstTime)

// forgot password
route.post('/OtpSend',login_ct.OtpSend)

// confirm otp for reset password
route.post('/validateOTP',login_ct.validateOTP);

// reset Password
route.post('/resetPassword',login_ct.resetPassword)


// user
// get all student
route.post('/getAllUserByRole',auth_s.isTokenInHeader,user_ct.getAllUserByRole)

// get user data
route.post('/getUserData',auth_s.isTokenInHeader,user_ct.getUserData)

// update user data
route.post('/updateUserData',auth_s.isTokenInHeader,user_ct.updateUserData)

// update email
route.post('/updateEmail',auth_s.isTokenInHeader,user_ct.updateEmail)

// update email
route.post('/confirmPassword',auth_s.isTokenInHeader,user_ct.confirmPassword)


// PROJECT
// CREATE PROJECT
route.post('/createNewProject',auth_s.isTokenInHeader,project_ct.createNewProject)

// GET USER PROJECT AND CHECKING
route.post('/checkUserProject',auth.isTokenInHeader,project_ct.checkUserProject)

// INVITE ADVISOR
route.post('/inviteAdvisor',upload.single('proposal'),auth.isTokenInHeader,project_ct.inviteAdvisor)

// INVITE ADVISOR LIST
route.post('/inviteAdvisorList',auth.isTokenInHeader,project_ct.inviteAdvisorList)

// REPLY INVITE ADVISOR
route.post('/replyInviteAdvisor',auth.isTokenInHeader,project_ct.replyInviteAdvisor)

// DOWNLOAD
// DOWNLOAD PROPOSAL
route.post('/downloadProposal',auth.isTokenInHeader,project_ct.downloadProposal)
module.exports = route
