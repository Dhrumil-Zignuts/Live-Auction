const { validation, sendVerificationCode } = require("../../helper/userHelper")
const constants = require('../../../config/constants')
const bcrypt = require('bcrypt')
const User = require('../../model/User')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


module.exports = {
    loginUser: async (req, res) => {

        // get Data from the req.body
        const userData = {
            email: req.body.email,
            password: req.body.password,
            eventCode: constants.events.loginUser,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors
            })
        }

        // find the data from the DataBase
        let logedinUser
        try {
            logedinUser = await User.findOne({ email: userData.email, })
        } catch (err) {
            return res.status(500).json({
                message: 'You do not have an account with this email',
                error: err
            })
        }

        // Compare the password
        try {
            const comparePass = await bcrypt.compare(userData.password, logedinUser.password)
        } catch (err) {
            return res.status(500).json({
                message: 'please enter correct password',
                error: err
            })
        }

        try{
            const token  = await jwt.sign({email : logedinUser.email, id : logedinUser._id},process.env.JWT_SECRETKEY,{ expiresIn : '3h'})
            res.cookie('accessToken', token, {
                httpOnly: true
            })
            return res.status(500).json({
                message: 'You have Loged in Successfully',
                data : token
            })
        }catch(err){

        }
    },

    forgetPassword : async (req,res) => {
        const userData = {
            email : req.body.email,
            eventCode : constants.events.forgetPassword,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }

        // Chech Use has an Account with Email
        const findUser = await User.findOne({email: userData.email})
        if(!findUser){
            return res.status(500).json({
                hasError : true,
                message : 'You Do not have an Account with this email ID',
            })
        }

        // Send Confirmation Email
        const verificationCode = await sendVerificationCode(userData.email)

        if (verificationCode.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in sending the Verification Code',
                error: verificationCode.error
            })
        }

        // Update the Confirmation Code in DataBase
        try{
            const updateUser = await User.updateOne({email: userData.email},{$set : {code : verificationCode.data}})
            return res.status(200).json({
                message : 'Confirmation Code is sent to your Email',
                data : verificationCode.data
            })
        }catch(err){
            return res.status(500).json({
                message : 'There is an error in Update the confirmation Code for Forget Pass.',
                error : err
            })
        }
    },

    confirmUserForForgetPassword : async (req,res)=>{
        const userData = {
            email : req.body.email,
            code : req.body.code,
            eventCode : constants.events.confirmUserForForgetPassword,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }

        let findUser
        try{
            findUser = await User.findOne({email : userData.email})
        }catch(err){
            return res.status(500).json({
                message : 'You do not have an account with this email',
                error : err,
            })
        }

        if(userData.code == findUser.code){
            return res.status(200).json({
                hasError : false,
                message : 'Code Confirmation Successfully',
            })
        }else{
            return res.status(500).json({
                hasError : true,
                message: 'Enter correct verification Code'
            })
        }
    },

    setNewPassword : async (req,res) => {
        const userData ={
            email : req.body.email,
            password : req.body.password,
            eventCode : constants.events.setNewPassword
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a problem in the validation of data',
                error: validatedData.errors
            })
        }

        try{
            // convert tha password to hash password
            const hashpassword = await bcrypt.hash(userData.password , 10)

            // set the new Password in DataBase
            const updateOne = await User.updateOne({email: userData.email}, { $set : {password : hashpassword}})
            
            return res.status(200).json({
                message : 'New password is Successfully Updated',
                data      : updateOne
            })

        }catch(err){
            return res.status(500).json({
                message : 'There are an error while setting a new Password',
                error : err
            })
        }
    },
}