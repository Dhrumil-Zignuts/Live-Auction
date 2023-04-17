const mongoose = require('mongoose')
const { number } = require('../../config/constants')

const userSchema = mongoose.Schema({
    username : {
        type: String,
    },
    email: {
        type: String,
    },
    password:{
        type: String,
    },
    code:{
        type: String,
    },
    firstName : {
        type : String,
        default : "",
    },
    lastName:{
        type : String,
        default : "",
    },
    phone:{
        type : String,
        default : "",
    },
    Address : {
        AddressLine1 : {
            type: String,
            default : "",
        },
        AddressLine2 : {
            type : String,
            default : "",
        },
        City : {
            type : String,
            default : "",
        },
        State : {
            type : String,
            default : "",
        },
        Country : {
            type : String,
            default : "",
        }
    },
    isDeleted : {
        type : Boolean,
        default: false,
    },
    isConfirmed : {
        type : Boolean,
        default : false,
    },
    isActive : {
        type : Boolean,
        default : true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('users', userSchema)