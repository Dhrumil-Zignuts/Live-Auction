const { validation, sendVerificationCode } = require("../../helper/userHelper")
const constants = require('../../../config/constants')
const bcrypt = require('bcrypt')
const User = require('../../model/User')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


module.exports = {
    registerUser: async (req, res) => {

        // get Data from the req.body
        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            eventCode: constants.events.registedUser
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }

        // Convert Password in the Hash 
        try {
            const hashpassword = await bcrypt.hash(userData.password, 10)
            userData.password = hashpassword
        } catch (err) {
            return res.status(500).json({
                message: 'There is a problem in the password hashing',
                error: err
            })
        }

        // send the Confirmation Code
        const verificationCode = await sendVerificationCode(userData.email)

        if (verificationCode.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in sending the Verification Code',
                error: verificationCode.error
            })
        }

        // Add User to the DataBase
        userData['code'] = verificationCode.data
        try {
            const addNewUser = await User.create(userData)

            // Generate the Token 
            const token = jwt.sign({ email: addNewUser.email, id: addNewUser._id }, process.env.JWT_SECRETKEY, { expiresIn: '5h' })
            res.cookie('accessToken', token, {
                httpOnly: true
            })
            return res.status(200).json({
                message: 'Verification Code sent successfully',
                data: verificationCode.data
            })
        } catch (err) {
            return res.status(500).json({
                message: 'There is a Error in Adding user in DataBase',
                error: err
            })
        }


    },

    confirmUser: async (req, res) => {
        const userData = {
            email: req.body.email,
            code: req.body.code,
            eventCode : constants.events.confirmUser
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }

        const findUser = await User.findOne({ email: userData.email })

        if (!findUser) {
            res.status(500).json({
                message: 'You do not have an account with this email Id'
            })
        }

        if (userData.code == findUser.code) {
            return res.status(200).json({
                message: 'Confirmation Code is Matched Successfully',
                matched: true
            })
        } else {
            return res.status(500).json({
                message: 'Confirmation Code is not Match',
                matched: false
            })
        }
    },

    resendConfirmationCode: async (req, res) => {
        const userData = {
            email: req.body.email,
            eventCode : constants.events.resendConfirmationCode,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }


        // resend the Confirmation Code
        const verificationCode = await sendVerificationCode(userData.email)
        if (verificationCode.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in sending the Verification Code',
                error: verificationCode.error
            })
        }

        try{
            const updateUser = await User.updateOne({email : userData.email}, { $set: { code: verificationCode.data } })
            return res.status(200).json({
                hasError : false,
                message: 'Verification Code Updated SuccessFully',
                data : verificationCode.data
            })
        }catch(err){
            return res.status(500).json({
                hasError: true,
                message : 'There is an error in update Verification Code',
                error : err
            })
        }
    },
}