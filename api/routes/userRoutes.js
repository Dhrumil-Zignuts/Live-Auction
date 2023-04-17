const express = require('express')
const authController = require('../controller/Auth/authController')
const registrationController = require('../controller/Registration/registrationController')
const userController = require('../controller/User/userController')
const adminController = require('../controller/Admin/adminController')

const router = express.Router()

// Register New User Routes 
router.post('/registerUser', registrationController.registerUser)
router.post('/confirmUser', registrationController.confirmUser)
router.post('/resendConfirmationCode', registrationController.resendConfirmationCode)

// Authentication Routes 
router.post('/loginUser', authController.loginUser)
router.post('/forgetPassword', authController.forgetPassword)
router.post('/confirmUserForForgetPassword', authController.confirmUserForForgetPassword)
router.post('/setNewPassword', authController.setNewPassword)

// User Routes
router.post('/getUser', userController.getUser)
router.post('/deleteUser', userController.deleteUser)
router.post('/updateUser', userController.updateUser)

// Admin Routes

router.get('/adminGetAllUsers', adminController.adminGetAllUsers)
router.post('/adminGetUser', adminController.adminGetUser)
router.post('/adminUpdateUser', adminController.adminUpdateUser)
router.post('/adminDeleteUser', adminController.adminDeleteUser)

module.exports = router