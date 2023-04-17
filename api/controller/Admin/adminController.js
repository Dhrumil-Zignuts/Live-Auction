const { validation, sendVerificationCode } = require("../../helper/userHelper")
const constants = require('../../../config/constants')
const bcrypt = require('bcrypt')
const User = require('../../model/User')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')

module.exports = {
    adminGetAllUsers: async (req, res) => {

        try {
            const getAllUser = await User.find({ isDeleted: false })
            return res.status(200).json({
                hasError: false,
                message: 'Here are all Active Users',
                data: getAllUser,
            })
        } catch (err) {
            return res.status(500).json({
                hasError: true,
                message: 'There is an error while getting All Users',
                error: err
            })
        }
    },

    adminGetUser: async (req, res) => {
        const userData = {
            userId: req.body.id,
            eventCode: constants.events.adminGetUser,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                hasError: true,
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors,
            })
        }

        try {
            const getUser = await User.findOne({ _id: userData.userId })

            return res.status(200).json({
                hasError: false,
                message: 'User Find Successfuly',
                data: getUser,
            })
        } catch (err) {
            return res.status(500).json({
                hasError: true,
                message: 'There is an error in finding users',
                error: err
            })
        }
    },

    adminDeleteUser: async (req, res) => {
        const userData = {
            userId: req.body.id,
            eventCode: constants.events.adminDeleteUser,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                hasError: true,
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors,
            })
        }

        try {
            const deleteUser = await User.updateOne({ _id: userData.userId }, {$set : {isDeleted : true}})
            return res.status(200).json({
                hasError: false,
                message: 'User Deleted Successfuly',
                data: deleteUser,
            })

        } catch (err) {
            return res.status(500).json({
                hasError: true,
                message: 'There is an Error in Deleting User',
                error: err,
            })
        }
    },

    adminUpdateUser: async (req, res) => {
        
        const userData = {
            userId: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            Address: {
                AddressLine1: req.body.Address.AddressLine1,
                AddressLine2: req.body.Address.AddressLine2,
                City: req.body.Address.City,
                State: req.body.Address.State,
                Country: req.body.Address.Country,
            },
            eventCode: constants.events.adminUpdateUser,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                hasError: true,
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors,
            })
        }

        try{
            const updateUser = await User.updateOne({_id : userData.userId }, {$set : userData})

            return res.status(200).json({
                hasError: false,
                message: 'User Updated Successfuly',
                data: updateUser,
            })
        }catch(err){
            return res.status(500).json({
                hasError: true,
                message: 'There is a Error in the Updating User',
                error: err,
            })
        }
    }
}