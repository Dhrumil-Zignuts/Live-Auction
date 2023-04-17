require('dotenv').config()
const nodemailer = require('nodemailer')

const events = {
    registedUser : 1,
    confirmUser : 2,
    resendConfirmationCode: 3,
    loginUser:4,
    forgetPassword : 5,
    confirmUserForForgetPassword : 6,
    setNewPassword : 7,
    getUser : 8,
    updateUser : 9,
    deleteUser : 10,
    adminGetUser : 11,
    adminDeleteUser : 12,
    adminUpdateUser : 13,
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: "sundieblhghfkuzh"
    }
})

const number = Math.random().toString().substr(2, 6)

module.exports = {
    events,
    transporter,
    number,
}