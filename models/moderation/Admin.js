/*
    *Model for admins
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Admin = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref:'users',
        required: true,
        unique: true
    },
    type:{
        type: String,
        enum: [
            'owner',
            'admin',
            'staff'
        ],
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('admins', Admin)