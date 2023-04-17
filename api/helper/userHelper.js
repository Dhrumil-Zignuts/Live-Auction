require('dotenv').config()
const constants = require('../../config/constants')
const validator = require('validatorjs')
const { transporter, number } = require('../../config/constants')



module.exports = {
    validation: (userdata) => {
        console.log('validation called .........!');
        switch (userdata.eventCode) {
            case constants.events.registedUser:
                data = {
                    username: userdata.username,
                    email: userdata.email,
                    password: userdata.password
                }
                rules = {
                    username: 'required|string',
                    email: 'required|email',
                    password: 'required|string|min:8|max:30'
                }
                break;

            case constants.events.confirmUser:
                data = {
                    email: userdata.email,
                    code: userdata.code,
                }
                rules = {
                    email: 'required|email',
                    code: 'required|string|min:6|max:6'
                }
                break;

            case constants.events.resendConfirmationCode:
                data = {
                    email: userdata.email,
                }
                rules = {
                    email: 'required|email',
                }
                break;

            case constants.events.loginUser:
                data = {
                    email: userdata.email,
                    password: userdata.password
                }
                rules = {
                    email: 'required|email',
                    password: 'required|string|min:8|max:30'
                }
                break;

            case constants.events.forgetPassword:
                data = {
                    email: userdata.email,
                }
                rules = {
                    email: 'required|email',
                }
                break;

            case constants.events.confirmUserForForgetPassword:
                data = {
                    email: userdata.email,
                    code: userdata.code
                }
                rules = {
                    email: 'required|email',
                    code: 'required|string|min:6|max:6'
                }
                break;

            case constants.events.setNewPassword:
                data = {
                    email: userdata.email,
                    password: userdata.password
                }
                rules = {
                    email: 'required|email',
                    password: 'required|string|min:8|max:30'
                }
                break;

            case constants.events.getUser:
                data = {
                    id: userdata.userId
                }

                rules = {
                    id: 'required|string'
                }
                break;

            case constants.events.updateUser:
                console.log(userdata);
                data = {
                    id: userdata.userId,
                    firstName: userdata.firstName,
                    lastName: userdata.lastName,
                    phone: userdata.phone,
                    Address: {
                        AddressLine1: userdata.Address.AddressLine1,
                        AddressLine2: userdata.Address.AddressLine2,
                        City: userdata.Address.City,
                        State: userdata.Address.State,
                        Country: userdata.Address.Country,
                    }
                }

                rules = {
                    id: 'required|string',
                    firstName: 'required|string',
                    lastName: 'required|string',
                    phone: 'required|numeric',
                    Address: {
                        AddressLine1: 'required|string',
                        AddressLine2: 'string',
                        City: 'required|string',
                        State: 'required|string',
                        Country: 'required|string',
                    }
                }
                break;

            case constants.events.deleteUser:
                data = {
                    id: userdata.userId
                }

                rules = {
                    id: 'required|string'
                }
                break;

            case constants.events.adminGetUser:
                data = {
                    id: userdata.userId
                }
                rules = {
                    id: 'required|string'
                }
                break;

            case constants.events.adminDeleteUser:
                data = {
                    id: userdata.userId
                }
                rules = {
                    id: 'required|string'
                }
                break;

            case constants.events.adminUpdateUser:
                data = {
                    userId: userdata.userId,
                    firstName: userdata.firstName,
                    lastName: userdata.lastName,
                    phone: userdata.phone,
                    Address: {
                        AddressLine1: userdata.Address.AddressLine1,
                        AddressLine2: userdata.Address.AddressLine2,
                        City: userdata.Address.City,
                        State: userdata.Address.State,
                        Country: userdata.Address.Country,
                    }
                }

                rules = {
                    userId: 'required|string',
                    firstName: 'required|string',
                    lastName: 'required|string',
                    phone: 'required|string',
                    Address: {
                        AddressLine1: 'required|string',
                        AddressLine2: 'string',
                        City: 'required|string',
                        State: 'required|string',
                        Country: 'required|string',
                    }
                }
                break;

            default:
                break;
        }

        const validation = new validator(data, rules)
        let result = {}

        if (validation.passes()) {
            console.log('VAlidation Pass Successfully :)');
            result['hasError'] = false
        }

        if (validation.fails()) {
            console.log('valiadtion Fails :(');
            result['hasError'] = true
            result['errors'] = validation.errors.all()
        }
        return result
    },

    sendVerificationCode: async (userMail) => {
        console.log('userMail: ', userMail);
        console.log('sendVerificationCode called: ');

        const options = {
            from: process.env.EMAIL,
            to: userMail,
            subject: "Welcome to Live Auction!",
            html: `<h3>This is a Verication code..! Do Not Share it with anyone</h3><br><h2>${number}</h2>`
        }
        let result = {}

        try {
            const verificationCode = await transporter.sendMail(options)
            result['hasError'] = false
            result['data'] = number
            console.log('data result: ', result);
            return result
        } catch (err) {
            result['hasError'] = true
            result['error'] = err
            console.log('err result: ', result);
            return result
        }
    }
}
// if (err) {
//     
// } else {
//     
// }