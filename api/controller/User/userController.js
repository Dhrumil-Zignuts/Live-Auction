const constants = require('../../../config/constants')
const { validation } = require('../../helper/userHelper')
const User = require('../../model/User')

module.exports = {
    getUser: async (req, res) => {
        
        const userData = {
            userId: req.body.id,
            eventCode: constants.events.getUser,
        }

        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors
            })
        }

        try {
            const findUser = await User.findOne({ _id: userData.userId })
            return res.status(500).json({
                hasError: false,
                message: 'There is tha user Data',
                data: findUser,
            })
        } catch (err) {
            return res.status(500).json({
                hasError: true,
                message: 'We did not find you account',
                error: err,
            })
        }
    },

    updateUser: async (req, res) => {
        
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
            eventCode: constants.events.updateUser,
        }
        
        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors
            })
        }

        try {
            const updateUser = await User.updateOne({ _id: userData.userId }, { $set: userData })
            return res.status(200).json({
                hasError: false,
                message: 'User is Updated SucceeFully',
                data: updateUser
            })
        } catch (err) {
            return res.status(500).json({
                hasError: true,
                message: 'There is an error while Updating the User Details',
                error: err
            })
        }
    },

    deleteUser: async (req, res) => {
        const userData = {
            userId: req.body.id,
            eventCode: constants.events.deleteUser,
        }
        // send the data for validation
        const validatedData = await validation(userData)

        if (validatedData.hasError == true) {
            return res.status(500).json({
                message: 'There is a Error in the Vslidation',
                error: validatedData.errors
            })
        }

        try{
            const deleteUser = await User.updateOne({_id : userData.userId}, {$set : {isDeleted : true}})
            return res.status(200).json({
                hasError : false,
                message : 'User is SuccessFully Deleted',
                data : deleteUser
            })
        }catch(err){
            return res.status(500).json({
                hasError : true,
                message : 'there is an error in Delete User',
                error : err
            })

        }
    }
}