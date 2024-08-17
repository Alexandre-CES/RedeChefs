//User account
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username:{
        type: String
    },
    user:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: false,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    creationDate:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('users', User)