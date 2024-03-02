const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    username:{
        type: String
    },
    user:{
        type: String,
        require: true
    },
    email:{
        type: String,
        required: false
    },
    password:{
        type: String,
        require: true
    },
    CreationDate:{
        type: Date,
        default: Date.now()
    },
    admin:{
        type: Number,
        default: 0
    }

})

module.exports('users', User)