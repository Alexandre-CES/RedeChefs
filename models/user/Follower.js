const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Follower = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    follower:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
})

module.exports = mongoose.model('followers', Follower)